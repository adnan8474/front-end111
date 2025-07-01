import React from 'react';
import { parseFile } from '../utils/parser';

export default function UploadForm({ onData }) {
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);
      onData(rows);
    } catch (error) {
      alert("Error parsing file: " + error.message);
      console.error(error);
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
