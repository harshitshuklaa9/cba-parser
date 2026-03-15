'use client';
import { ParsedAgreement } from '@/lib/types';

interface LibraryPanelProps {
  library: ParsedAgreement[];
  activeId?: string;
  onSelect: (agreement: ParsedAgreement) => void;
}

const tradeBadgeColors: Record<string, string> = {
  Electrical: 'bg-yellow-100 text-yellow-700',
  Carpentry: 'bg-amber-100 text-amber-700',
  Laborer: 'bg-green-100 text-green-700',
  Plumbing: 'bg-blue-100 text-blue-700',
  Ironwork: 'bg-gray-200 text-gray-700',
  Other: 'bg-gray-100 text-gray-600',
};

export default function LibraryPanel({ library, activeId, onSelect }: LibraryPanelProps) {
  const clearSaved = () => {
    localStorage.removeItem('cba-library');
    window.location.reload();
  };

  const userAgreements = library.filter(a => a.source !== 'seed');

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Agreements</p>
        <div className="space-y-1">
          {library.map((agreement) => (
            <button
              key={agreement.id}
              onClick={() => onSelect(agreement)}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                activeId === agreement.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">{agreement.unionName}</span>
                {agreement.source === 'seed' && (
                  <span className="text-[10px] font-medium bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded shrink-0">SEED</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  tradeBadgeColors[agreement.trade] || tradeBadgeColors.Other
                }`}>
                  {agreement.trade}
                </span>
                <span className="text-xs text-gray-400">{agreement.state}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(agreement.parsedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>
      {userAgreements.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={clearSaved}
            className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear saved agreements
          </button>
        </div>
      )}
    </div>
  );
}
