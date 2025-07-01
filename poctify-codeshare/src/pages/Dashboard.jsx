
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import SummaryPanel from '../components/SummaryPanel';
import SuspiciousTable from '../components/SuspiciousTable';
import RecordsTable from '../components/RecordsTable';
import ChartsPanel from '../components/ChartsPanel';
import { detectAnomalies } from '../utils/anomalyDetector';

function ScoringInfoBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white text-gray-800 p-4 rounded shadow-md mb-4">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <h2 className="font-bold">📊 Scoring Logic Summary</h2>
        <button className="text-sm text-poctifyBlue underline">{open ? 'Hide' : 'Show'}</button>
      </div>
      {open && (
        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
          <li><strong>+2</strong> for tests outside 07:00–20:00</li>
          <li><strong>+5</strong> for fast location changes</li>
          <li><strong>+2</strong> for fast device changes</li>
          <li><strong>+4</strong> for bursts (≥3 tests in 5 min)</li>
          <li><strong>+2</strong> per test above 15/hr</li>
          <li>High scores may flag misuse or barcode sharing</li>
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  function onData(data) {
    setRows(data);
    setAnomalies(detectAnomalies(data));
  }

  return (
    <div className="p-6 grid grid-cols-1 gap-6" id="report-container">
      <UploadForm onData={onData} />
      <ScoringInfoBox />
      <SummaryPanel anomalies={anomalies} totalTests={rows.length} />
      <SuspiciousTable data={anomalies} />
      <ChartsPanel anomalies={anomalies} />
      <RecordsTable rows={rows} />
    </div>
  );
}
