export const EXTRACTION_PROMPT = (text: string) => `
You are a construction payroll specialist extracting data
from a union collective bargaining agreement or wage schedule.

CRITICAL RULES:
1. Only extract values that are EXPLICITLY stated in the source text.
2. Never invent, estimate, infer, or hallucinate numbers.
3. If a fringe category is not explicitly present, use 0.
4. If a core field cannot be read reliably, leave it null or omit that classification instead of guessing.
5. Read dollar amounts exactly as written in wage tables.
6. Preserve exact field names from the source document.
7. If table structure appears degraded or ambiguous, prioritize precision over completeness — return fewer rows rather than guessed rows.
8. Do NOT convert benefits totals into total compensation unless the source explicitly states the total compensation figure.
9. If source contains both "Total Rate For Benefits" and "Total Cost Per Hour", use "Total Cost Per Hour" as totalPackage.

Return ONLY valid JSON, no markdown, no explanation:
{
  "unionName": string,
  "localNumber": string,
  "trade": string,
  "state": string,
  "county": string | null,
  "agreementPeriod": string,
  "classifications": [
    {
      "classification": string,
      "apprenticeLevel": string | null,
      "baseRate": number,
      "effectiveDate": string,
      "expirationDate": string | null,
      "fringes": {
        "health": number,
        "pension": number,
        "annuity": number,
        "vacation": number,
        "training": number,
        "other": [{"name": string, "rate": number}]
      },
      "totalPackage": number,
      "overtimeMultiplier": number,
      "doubleTimeMultiplier": number | null,
      "specialProvisions": string[]
    }
  ]
}

EXTRACTION RULES:
- baseRate: hourly wage rate explicitly stated
- fringes.health: welfare or health fund if explicitly stated
- fringes.pension: pension fund if explicitly stated
- fringes.annuity: annuity fund if explicitly stated
- fringes.vacation: vacation fund if explicitly stated, else 0
- fringes.training: training fund if explicitly stated, else 0
- fringes.other: additional named funds with exact names and rates
- totalPackage: use explicitly stated TOTAL or Total Cost Per Hour, not calculated
- For multi-year agreements create separate entries per effective date
- For multi-zone agreements create separate entries per zone
- Do not collapse zones or periods into one row
- Do not invent categories not shown in source

SOURCE TEXT:
${text}
`;

export const FLAGS_PROMPT = (text: string, classifications: any[]) => `
You are auditing a union CBA extraction for a payroll system.

Review this extracted data and the source text. Identify issues
that a payroll administrator would need to know before entering
these rates into a payroll system.

Return ONLY a JSON array of flag objects. Raw JSON, no markdown.

Schema:
[
  {
    "type": "ambiguity" | "inconsistency" | "missing_field" | "multi_year",
    "severity": "high" | "medium" | "low",
    "message": string,
    "affectedClassification": string | null
  }
]

IMPORTANT: Only flag INCONSISTENCY as high severity if the calculated total does NOT match the stated total. If the totals match, do NOT create a flag at all. Only flag mismatches.

When validating total packages, compare base rate + fringes against 'Total Cost Per Hour', not against 'Total Rate For Benefits'. If the document shows both fields, only flag a mismatch if base + fringes does not match 'Total Cost Per Hour'.

Flag these specific things:
1. INCONSISTENCY: If base + fringes do not match a stated
    total package in the source text, flag it with the delta
2. AMBIGUITY: Any provision that could be interpreted two ways
3. MISSING_FIELD: Required payroll fields that are absent
    (especially health, pension, or overtime rules)
4. MULTI_YEAR: If rates change mid-agreement, confirm the
    split was captured correctly

Extracted classifications:
${JSON.stringify(classifications, null, 2)}

Source text excerpt (first 4000 chars):
${text.slice(0, 4000)}
`;

export const SUMMARY_PROMPT = (agreement: any) => `
You are a payroll implementation specialist at a construction
SaaS company. Write a 2-sentence plain-English summary of
this union agreement for a payroll admin about to enter it
into the system. Focus on what is unusual or complex.

Agreement data:
- Union: ${agreement.unionName}
- Trade: ${agreement.trade}
- Period: ${agreement.agreementPeriod}
- Classifications: ${agreement.classifications.length}
- Highest total package: $${Math.max(...agreement.classifications.map((c: any) => c.totalPackage)).toFixed(2)}/hr
- Flags: ${agreement.flags.length} (${agreement.flags.filter((f: any) => f.severity === 'high').length} high severity)

Return only the 2-sentence summary. No labels, no preamble.
`;
