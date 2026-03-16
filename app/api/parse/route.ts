// Polyfill DOMMatrix for serverless environment
if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class DOMMatrix {
    constructor() {}
    static fromMatrix() { return new (globalThis as any).DOMMatrix(); }
  };
}
if (typeof globalThis.DOMRect === 'undefined') {
  (globalThis as any).DOMRect = class DOMRect {
    constructor() {}
  };
}
if (typeof globalThis.DOMPoint === 'undefined') {
  (globalThis as any).DOMPoint = class DOMPoint {
    constructor() {}
  };
}
if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D {
    constructor() {}
  };
}

import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { EXTRACTION_PROMPT, FLAGS_PROMPT, SUMMARY_PROMPT } from '@/lib/prompts';

const client = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pastedText = formData.get('text') as string | null;

    let text = '';

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Use pdfjs-dist for text extraction
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = false;
      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      const textParts: string[] = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        textParts.push(pageText);
      }
      text = textParts.join('\n');
    } else if (pastedText) {
      text = pastedText;
    } else {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    if (text.length < 100) {
      return NextResponse.json({ error: 'Text too short to parse' }, { status: 400 });
    }

    // LLM CALL 1: Extract wage data
    const extractionResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [{ role: 'user', content: EXTRACTION_PROMPT(text) }]
    });

    const extractionText = extractionResponse.choices[0].message.content ?? '';

    let extracted;
    try {
      extracted = JSON.parse(extractionText.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      return NextResponse.json({ error: 'Failed to parse extraction response' }, { status: 500 });
    }

    // LLM CALL 2: Generate flags
    const flagsResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: FLAGS_PROMPT(text, extracted.classifications || [])
      }]
    });

    const flagsText = flagsResponse.choices[0].message.content ?? '[]';

    let flags = [];
    try {
      flags = JSON.parse(flagsText.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      flags = [];
    }

    // LLM CALL 3: Plain English summary
    const summaryResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: SUMMARY_PROMPT({ ...extracted, flags })
      }]
    });

    const summary = summaryResponse.choices[0].message.content?.trim() ?? '';

    // Add IDs to classifications
    const classificationsWithIds = (extracted.classifications || []).map(
      (c: any, i: number) => ({ ...c, id: `c${i + 1}` })
    );

    const agreement = {
      id: `parsed-${Date.now()}`,
      ...extracted,
      classifications: classificationsWithIds,
      flags,
      summary,
      rawTextPreview: text.slice(0, 500),
      parsedAt: new Date().toISOString(),
      source: file ? 'upload' : 'paste'
    };

    return NextResponse.json(agreement);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
