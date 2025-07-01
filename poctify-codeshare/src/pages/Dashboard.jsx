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
      <UploadForm onData={onData} />
      <SummaryPanel anomalies={anomalies} totalTests={rows.length} />
      <SuspiciousTable data={anomalies} />
      <ChartsPanel anomalies={anomalies} />
      <RecordsTable rows={rows} />
    </div>
  );
}
