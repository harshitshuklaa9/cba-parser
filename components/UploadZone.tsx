'use client';
import { useState, useRef, DragEvent } from 'react';

const DEMO_TEXT = `AGREEMENT BETWEEN MASON TENDERS DISTRICT COUNCIL OF
NEW YORK AND VICINITY AND CONTRACTORS Effective July 1, 2024

ARTICLE 14 - WAGES AND BENEFITS

Section 14.1 WAGE RATES
Laborer (General): $52.35 per hour
Mason Tender: $54.85 per hour
Foreman: $58.65 per hour
General Foreman: $62.40 per hour

Section 14.2 BENEFIT CONTRIBUTIONS (per hour worked)
Health & Welfare Fund: $17.42
Pension Fund: $12.80
Annuity Fund: $8.25
Vacation Fund: $4.19
Training Fund: $1.05
Industry Advancement Fund: $0.35
Legal Services Fund: $0.42
Total Package - Laborer: $96.83
Total Package - Mason Tender: $99.33

Section 14.3 OVERTIME
Time and one-half for all hours over 8 per day
Double time for all Saturday, Sunday and Holiday work
Saturday: premium pay requires prior authorization

Section 14.4 SHIFT DIFFERENTIAL
Second shift (3pm-11pm): 15% premium on base rate
Third shift (11pm-7am): 20% premium on base rate`;

interface UploadZoneProps {
  onParse: (file?: File, text?: string) => void;
  loading: boolean;
}

export default function UploadZone({ onParse, loading }: UploadZoneProps) {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedFile = useRef<File | null>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      selectedFile.current = file;
      setFileName(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      selectedFile.current = file;
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    if (mode === 'upload' && selectedFile.current) {
      onParse(selectedFile.current);
    } else if (mode === 'paste' && text.trim()) {
      onParse(undefined, text);
    }
  };

  const handleLoadDemo = () => {
    setText(DEMO_TEXT);
    setMode('paste');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            mode === 'upload'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upload PDF
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            mode === 'paste'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Paste Text
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : fileName
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          {fileName ? (
            <p className="text-sm text-green-700">{fileName}</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">Drop a CBA PDF here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PDF files only</p>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste wage schedule section from a CBA..."
          className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || (mode === 'upload' ? !fileName : !text.trim())}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'Parsing...' : 'Parse Agreement'}
        </button>
        <button
          onClick={handleLoadDemo}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Load Demo
        </button>
      </div>
    </div>
  );
}
