import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const { classifications, rawText } = await request.json();

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a payroll compliance auditor. Cross-check these extracted union rates against the source text. Return ONLY a JSON array of any discrepancies found.

Schema: [{ "field": string, "extracted": string, "expected": string, "classification": string }]

If no discrepancies, return an empty array: []

Extracted data:
${JSON.stringify(classifications, null, 2)}

Source text:
${rawText?.slice(0, 4000) || 'No source text provided'}`
      }]
    });

    const text = response.choices[0].message.content ?? '[]';
    let discrepancies = [];
    try {
      discrepancies = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    } catch {
      discrepancies = [];
    }

    return NextResponse.json({ discrepancies });
  } catch (error) {
    console.error('Validate error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
