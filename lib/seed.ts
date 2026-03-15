import { ParsedAgreement } from './types';

export const SEED_AGREEMENTS: ParsedAgreement[] = [
  {
    id: 'seed-ibew-local3-2024',
    unionName: 'IBEW Local 3',
    localNumber: '3',
    trade: 'Electrical',
    state: 'New York',
    county: 'New York (Manhattan)',
    agreementPeriod: '2022-2025',
    source: 'seed',
    parsedAt: new Date().toISOString(),
    rawTextPreview: 'NYC Construction Division A Agreement — Journeypersons and Apprentices',
    classifications: [
      {
        id: 'c1',
        classification: 'Journeyman Wireman (A Rate)',
        baseRate: 61.87,
        effectiveDate: 'May 1, 2024',
        fringes: {
          health: 22.10,
          pension: 14.75,
          annuity: 5.80,
          vacation: 3.71,
          training: 0.85,
          other: [
            { name: 'NEBF', rate: 1.24 },
            { name: 'Industry Fund', rate: 0.15 },
          ]
        },
        totalPackage: 110.47,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: [
          'Shift differential: 15% premium for second shift',
          'Double time on Sundays and holidays',
          'Tool allowance: $0.50/hr on tunnel work'
        ]
      },
      {
        id: 'c2',
        classification: 'Foreman',
        baseRate: 68.06,
        effectiveDate: 'May 1, 2024',
        fringes: {
          health: 22.10,
          pension: 14.75,
          annuity: 5.80,
          vacation: 4.08,
          training: 0.85,
          other: [
            { name: 'NEBF', rate: 1.36 },
            { name: 'Industry Fund', rate: 0.15 },
          ]
        },
        totalPackage: 117.15,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: ['10% above Journeyman rate by agreement']
      },
      {
        id: 'c3',
        classification: 'Apprentice — 1st Year (40%)',
        apprenticeLevel: '1st Year',
        baseRate: 24.75,
        effectiveDate: 'May 1, 2024',
        fringes: {
          health: 22.10,
          pension: 7.50,
          annuity: 2.32,
          vacation: 1.49,
          training: 0.85,
          other: [{ name: 'NEBF', rate: 0.50 }]
        },
        totalPackage: 59.51,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: ['Rate is 40% of Journeyman base wage']
      },
      {
        id: 'c4',
        classification: 'Apprentice — 5th Year (80%)',
        apprenticeLevel: '5th Year',
        baseRate: 49.50,
        effectiveDate: 'May 1, 2024',
        fringes: {
          health: 22.10,
          pension: 12.00,
          annuity: 4.64,
          vacation: 2.97,
          training: 0.85,
          other: [{ name: 'NEBF', rate: 0.99 }]
        },
        totalPackage: 93.05,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: ['Rate is 80% of Journeyman base wage']
      }
    ],
    flags: [
      {
        type: 'multi_year',
        severity: 'medium',
        message: 'Agreement runs 2022-2025 with annual rate escalations. These are May 2024 rates. Verify May 2025 step-up has been applied.',
        affectedClassification: 'All classifications'
      },
      {
        type: 'ambiguity',
        severity: 'low',
        message: 'Tunnel work tool allowance applies only to specific job codes. Confirm with contractor which jobs qualify.',
        affectedClassification: 'Journeyman Wireman (A Rate)'
      }
    ],
    summary: 'IBEW Local 3 NYC Construction is one of the highest-package electrical agreements in the country — total labor cost for a Journeyman exceeds $110/hr including fringes. The multi-tier apprentice scale (40% through 90% of journeyman) requires careful classification verification at each hire.'
  },
  {
    id: 'seed-carpenters-nyc-2024',
    unionName: 'NYC District Council of Carpenters',
    localNumber: 'DC',
    trade: 'Carpentry',
    state: 'New York',
    county: 'New York (Manhattan)',
    agreementPeriod: '2021-2026',
    source: 'seed',
    parsedAt: new Date().toISOString(),
    rawTextPreview: 'NYC District Council of Carpenters — General Construction Agreement',
    classifications: [
      {
        id: 'c1',
        classification: 'Journeyman Carpenter',
        baseRate: 57.31,
        effectiveDate: 'July 1, 2024',
        fringes: {
          health: 18.50,
          pension: 15.25,
          annuity: 6.40,
          vacation: 3.44,
          training: 0.72,
          other: [
            { name: 'NYCDCC Benefit Funds', rate: 0.40 },
          ]
        },
        totalPackage: 102.02,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: [
          'Double time after 10 hours on weekdays',
          'Double time all day Saturday, Sunday, holidays',
          'Shop steward premium: $1.50/hr over journeyman rate'
        ]
      },
      {
        id: 'c2',
        classification: 'Foreman Carpenter',
        baseRate: 60.18,
        effectiveDate: 'July 1, 2024',
        fringes: {
          health: 18.50,
          pension: 15.25,
          annuity: 6.40,
          vacation: 3.61,
          training: 0.72,
          other: [{ name: 'NYCDCC Benefit Funds', rate: 0.40 }]
        },
        totalPackage: 105.06,
        overtimeMultiplier: 1.5,
        doubleTimeMultiplier: 2.0,
        specialProvisions: ['5% above journeyman rate minimum']
      }
    ],
    flags: [
      {
        type: 'missing_field',
        severity: 'high',
        message: 'Saturday/Sunday overtime rules differ from standard. Verify contractor scheduling practices — double time applies all day on weekends, not just after 8 hours.',
        affectedClassification: 'Journeyman Carpenter'
      }
    ],
    summary: 'NYC Carpenters DC agreement includes aggressive double-time provisions — all weekend hours at 2x, not just after 8 hours. Total package exceeds $100/hr. Any contractor scheduling weekend work will see labor costs roughly double vs. weekday rates.'
  }
];
