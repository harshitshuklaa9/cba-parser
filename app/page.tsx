'use client';
import { useState, useEffect } from 'react';
import { ParsedAgreement } from '@/lib/types';
import { SEED_AGREEMENTS } from '@/lib/seed';
import UploadZone from '@/components/UploadZone';
import RateTable from '@/components/RateTable';
import FlagsPanel from '@/components/FlagsPanel';
import LibraryPanel from '@/components/LibraryPanel';
import ExportButton from '@/components/ExportButton';

export default function Home() {
  const [library, setLibrary] = useState<ParsedAgreement[]>([]);
  const [active, setActive] = useState<ParsedAgreement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('cba-library');
    const parsed = stored ? JSON.parse(stored) : [];
    const all = [...SEED_AGREEMENTS, ...parsed] as ParsedAgreement[];
    setLibrary(all);
    setActive(all[0]);
  }, []);

  const handleParse = async (file?: File, text?: string) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (text) formData.append('text', text);

      const res = await fetch('/api/parse', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Parse failed');

      const agreement = await res.json() as ParsedAgreement;

      const stored = localStorage.getItem('cba-library');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [agreement, ...existing];
      localStorage.setItem('cba-library', JSON.stringify(updated));

      setLibrary([...SEED_AGREEMENTS as ParsedAgreement[], ...updated]);
      setActive(agreement);
    } catch (e) {
      setError('Failed to parse agreement. Check the input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar — library */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">CBA Parser</span>
          </div>
          <p className="text-xs text-gray-500">Union rate extraction for payroll teams</p>
        </div>
        <LibraryPanel
          library={library}
          activeId={active?.id}
          onSelect={setActive}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            {active && (
              <>
                <h1 className="text-lg font-semibold text-gray-900">{active.unionName}</h1>
                <p className="text-sm text-gray-500">
                  {active.trade} · {active.state}{active.county ? `, ${active.county}` : ''} · {active.agreementPeriod}
                </p>
              </>
            )}
          </div>
          {active && <ExportButton agreement={active} />}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Upload zone — always visible at top */}
          <UploadZone onParse={handleParse} loading={loading} />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {active && (
            <div className="mt-8 space-y-6">
              {/* Summary */}
              {active.summary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 leading-relaxed">{active.summary}</p>
                </div>
              )}

              {/* Flags */}
              {active.flags?.length > 0 && <FlagsPanel flags={active.flags} />}

              {/* Rate table */}
              <RateTable classifications={active.classifications} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
