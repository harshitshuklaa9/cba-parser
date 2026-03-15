export interface PayClassification {
  id: string;
  classification: string;
  apprenticeLevel?: string;
  baseRate: number;
  effectiveDate: string;
  expirationDate?: string;
  fringes: {
    health: number;
    pension: number;
    annuity: number;
    vacation: number;
    training: number;
    other: { name: string; rate: number }[];
  };
  totalPackage: number;
  overtimeMultiplier: number;
  doubleTimeMultiplier?: number;
  specialProvisions: string[];
}

export interface ParsedAgreement {
  id: string;
  unionName: string;
  localNumber: string;
  trade: string;
  state: string;
  county?: string;
  agreementPeriod: string;
  classifications: PayClassification[];
  flags: Flag[];
  summary?: string;
  rawTextPreview: string;
  parsedAt: string;
  source: 'upload' | 'paste' | 'seed';
}

export interface Flag {
  type: 'ambiguity' | 'inconsistency' | 'missing_field' | 'multi_year';
  severity: 'high' | 'medium' | 'low';
  message: string;
  affectedClassification?: string;
}
