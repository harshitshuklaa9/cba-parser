'use client';
import { useState } from 'react';
import { Flag } from '@/lib/types';

interface FlagsPanelProps {
  flags: Flag[];
}

const severityStyles = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const typeIcons: Record<Flag['type'], string> = {
  inconsistency: '⚠',
  ambiguity: '?',
  missing_field: '!',
  multi_year: '📅',
};

export default function FlagsPanel({ flags }: FlagsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>
          Flags & Warnings ({flags.length})
          {flags.filter(f => f.severity === 'high').length > 0 && (
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
              {flags.filter(f => f.severity === 'high').length} high
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {!collapsed && (
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          {flags.map((flag, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-2 rounded border text-sm ${severityStyles[flag.severity]}`}
            >
              <span className="text-base leading-none mt-0.5">{typeIcons[flag.type]}</span>
              <div className="flex-1 min-w-0">
                <p>{flag.message}</p>
                {flag.affectedClassification && (
                  <p className="text-xs opacity-75 mt-0.5">Affects: {flag.affectedClassification}</p>
                )}
              </div>
              <span className="text-xs font-medium uppercase shrink-0">{flag.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
