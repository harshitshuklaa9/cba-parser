'use client';
import { Fragment, useState } from 'react';
import { PayClassification } from '@/lib/types';

interface RateTableProps {
  classifications: PayClassification[];
}

function packageColor(total: number): string {
  if (total > 80) return 'text-green-700 bg-green-50';
  if (total >= 50) return 'text-yellow-700 bg-yellow-50';
  return 'text-gray-600 bg-gray-50';
}

export default function RateTable({ classifications }: RateTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600 sticky top-0 bg-gray-50">Classification</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Base Rate</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Health</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Pension</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Annuity</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Vacation</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Training</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Other</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">Total Pkg</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600 sticky top-0 bg-gray-50">OT</th>
            </tr>
          </thead>
          <tbody>
            {classifications.map((c) => {
              const otherTotal = c.fringes.other.reduce((sum, o) => sum + o.rate, 0);
              const isApprentice = !!c.apprenticeLevel;
              const isExpanded = expandedRow === c.id;

              return (
                <Fragment key={c.id}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : c.id)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                      isApprentice ? 'text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={isApprentice ? 'italic' : 'font-medium'}>{c.classification}</span>
                        {c.specialProvisions.length > 0 && (
                          <span className="text-xs text-blue-500">+{c.specialProvisions.length}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{c.effectiveDate}</span>
                    </td>
                    <td className="text-right py-3 px-3 font-mono">${c.baseRate.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${c.fringes.health.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${c.fringes.pension.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${c.fringes.annuity.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${c.fringes.vacation.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${c.fringes.training.toFixed(2)}</td>
                    <td className="text-right py-3 px-3 font-mono">${otherTotal.toFixed(2)}</td>
                    <td className="text-right py-3 px-3">
                      <span className={`font-mono font-medium px-2 py-0.5 rounded ${packageColor(c.totalPackage)}`}>
                        ${c.totalPackage.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-3 text-gray-500">
                      {c.overtimeMultiplier}x
                      {c.doubleTimeMultiplier && ` / ${c.doubleTimeMultiplier}x`}
                    </td>
                  </tr>
                  {isExpanded && c.specialProvisions.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan={10} className="px-4 py-3">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-medium text-gray-500 uppercase tracking-wider mb-1">Special Provisions</p>
                          {c.specialProvisions.map((p, i) => (
                            <p key={i}>• {p}</p>
                          ))}
                          {c.fringes.other.length > 0 && (
                            <>
                              <p className="font-medium text-gray-500 uppercase tracking-wider mt-2 mb-1">Other Fringes</p>
                              {c.fringes.other.map((o, i) => (
                                <p key={i}>• {o.name}: ${o.rate.toFixed(2)}/hr</p>
                              ))}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
