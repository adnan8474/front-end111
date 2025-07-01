import React, { useState } from 'react';
import { parseFile } from '../utils/parser';

export default function UploadForm({ onData }) {
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await parseFile(file);
      onData(rows);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        className="text-white"
      />
      {error && (
        <div className="bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      )}
      <a
        href="/template.csv"
        className="underline text-poctifySoft"
        download
      >
        Download CSV Template
      </a>
    </div>
  );
}
