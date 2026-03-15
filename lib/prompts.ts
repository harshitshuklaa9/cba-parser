export const EXTRACTION_PROMPT = (text: string) => `
You are a construction payroll specialist. You are reading a
union collective bargaining agreement and must extract all
wage and fringe benefit data with precision.

Extract the following from this CBA text and return ONLY valid
JSON matching the schema below. No explanation, no markdown,
no preamble. Raw JSON only.

Schema:
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

Rules:
- All rates are per hour in USD as decimal numbers
- If a rate is not explicitly stated, use 0, never guess
- If multiple effective dates exist (multi-year schedule),
   create a SEPARATE classification entry for each date period
  with the same classification name but different effectiveDate
- For totalPackage, sum base + all fringe components
- For trade, infer from context: Electrical, Carpentry,
   Plumbing, Ironwork, Drywall, Laborer, Operating Engineer,
   Teamster, Mason, Painter, or Other
- specialProvisions: capture shift differentials, hazard pay,
   tool allowances, travel pay as short plain-English strings

CBA TEXT:
${text.slice(0, 12000)}
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
