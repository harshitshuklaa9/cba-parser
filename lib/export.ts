import { ParsedAgreement } from './types';

export function generateCSV(agreement: ParsedAgreement): string {
  const headers = [
    'Union', 'Local', 'Trade', 'Classification', 'Apprentice Level',
    'Base Rate', 'Health', 'Pension', 'Annuity', 'Vacation', 'Training',
    'Other Fringes', 'Total Package', 'Effective Date', 'OT Multiplier',
    'Special Provisions'
  ];

  const rows = agreement.classifications.map(c => {
    const otherFringes = c.fringes.other.map(o => `${o.name}: $${o.rate.toFixed(2)}`).join('; ');
    const provisions = c.specialProvisions.join('; ');

    return [
      agreement.unionName,
      agreement.localNumber,
      agreement.trade,
      c.classification,
      c.apprenticeLevel || '',
      c.baseRate.toFixed(2),
      c.fringes.health.toFixed(2),
      c.fringes.pension.toFixed(2),
      c.fringes.annuity.toFixed(2),
      c.fringes.vacation.toFixed(2),
      c.fringes.training.toFixed(2),
      otherFringes,
      c.totalPackage.toFixed(2),
      c.effectiveDate,
      c.overtimeMultiplier.toString(),
      provisions
    ].map(field => `"${field.replace(/"/g, '""')}"`).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
