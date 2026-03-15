'use client';
import { useState, useRef, useEffect } from 'react';
import { ParsedAgreement } from '@/lib/types';
import { generateCSV, downloadCSV } from '@/lib/export';

interface ExportButtonProps {
  agreement: ParsedAgreement;
}

export default function ExportButton({ agreement }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCSV = () => {
    const csv = generateCSV(agreement);
    const filename = `${agreement.unionName.replace(/\s+/g, '_')}_rates.csv`;
    downloadCSV(filename, csv);
    setOpen(false);
  };

  const handleJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(agreement, null, 2));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        Export
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={handleCSV}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={handleJSON}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
          >
            Copy as JSON
          </button>
        </div>
      )}
    </div>
  );
}
