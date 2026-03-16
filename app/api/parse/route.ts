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
      const { extractText } = await import('unpdf');
      const { text: extractedText } = await extractText(
        new Uint8Array(arrayBuffer),
        { mergePages: true }
      );
      text = extractedText;
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
