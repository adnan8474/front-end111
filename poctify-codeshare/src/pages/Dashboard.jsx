
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import SummaryPanel from '../components/SummaryPanel';
import SuspiciousTable from '../components/SuspiciousTable';
import RecordsTable from '../components/RecordsTable';
import ChartsPanel from '../components/ChartsPanel';
import { detectAnomalies } from '../utils/anomalyDetector';

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  function onData(data) {
    setRows(data);
    setAnomalies(detectAnomalies(data));
  }

  return (
    <div className="p-6 grid grid-cols-1 gap-6" id="report-container">
      <div className="bg-white text-gray-800 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Instructions</h2>
        <ul className="list-disc list-inside text-sm">
          <li>Upload a file using the form below (CSV or Excel formats supported).</li>
          <li>The file must include the columns: Operator ID, Timestamp, Location, Device.</li>
          <li>After upload, a full summary of suspicious activity and trends will be displayed.</li>
          <li>Use the filters and export buttons to download data.</li>
        </ul>
      </div>

      <UploadForm onData={onData} />

      <SummaryPanel anomalies={anomalies} totalTests={rows.length} />

      <div className="bg-white text-gray-800 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Suspicious Operator Breakdown</h2>
        <p className="text-sm mb-2">This table highlights operators with high activity scores based on unusual behaviors.</p>
        <SuspiciousTable data={anomalies} />
      </div>

      <div className="bg-white text-gray-800 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Testing Trends by Hour & Operator</h2>
        <p className="text-sm mb-2">Shows hourly trends and top suspicious operators based on total anomaly score.</p>
        <ChartsPanel anomalies={anomalies} />
      </div>

      <div className="bg-white text-gray-800 p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">All Uploaded Records</h2>
        <p className="text-sm mb-2">Complete list of uploaded POCT records, sortable by timestamp and operator ID.</p>
        <RecordsTable rows={rows} />
      </div>
    </div>
  );
}
