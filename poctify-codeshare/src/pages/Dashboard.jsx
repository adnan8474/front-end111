import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import SummaryPanel from '../components/SummaryPanel';
import SuspiciousTable from '../components/SuspiciousTable';
import RecordsTable from '../components/RecordsTable';
import ChartsPanel from '../components/ChartsPanel';
import { detectAnomalies } from '../utils/anomalyDetector';

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [settings, setSettings] = useState({
    workingStart: 7,
    workingEnd: 20,
    applyNightPenalty: true,
    scoreThreshold: 3.5,
    burstThreshold: 1,
  });

  useEffect(() => {
    if (rows.length) {
      const res = detectAnomalies(rows, {
        workingHours: [settings.workingStart, settings.workingEnd],
        applyNightPenalty: settings.applyNightPenalty,
        suspiciousScore: settings.scoreThreshold,
        suspiciousBursts: settings.burstThreshold,
      });
      setAnomalies(res);
    }
  }, [rows, settings]);

  function onData(data) {
    setRows(data);
  }

  function updateSetting(key, value) {
    setSettings(s => ({ ...s, [key]: value }));
  }

  return (
    <div className="p-6 grid grid-cols-1 gap-6" id="report-container">
      <UploadForm onData={onData} />
      <div className="bg-white text-gray-800 p-4 rounded shadow-md space-y-2">
        <h2 className="font-bold">Advanced Settings</h2>
        <div className="flex space-x-2 items-center">
          <label className="flex items-center space-x-1">
            <span>Working start</span>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.workingStart}
              onChange={e => updateSetting('workingStart', Number(e.target.value))}
              className="w-16 text-black"
            />
          </label>
          <label className="flex items-center space-x-1">
            <span>End</span>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.workingEnd}
              onChange={e => updateSetting('workingEnd', Number(e.target.value))}
              className="w-16 text-black"
            />
          </label>
          <label className="flex items-center space-x-1">
            <span>Night Penalty</span>
            <input
              type="checkbox"
              checked={settings.applyNightPenalty}
              onChange={e => updateSetting('applyNightPenalty', e.target.checked)}
            />
          </label>
          <label className="flex items-center space-x-1">
            <span>Score ≥</span>
            <input
              type="number"
              value={settings.scoreThreshold}
              step="0.1"
              onChange={e => updateSetting('scoreThreshold', Number(e.target.value))}
              className="w-16 text-black"
            />
          </label>
          <label className="flex items-center space-x-1">
            <span>Bursts ≥</span>
            <input
              type="number"
              value={settings.burstThreshold}
              onChange={e => updateSetting('burstThreshold', Number(e.target.value))}
              className="w-16 text-black"
            />
          </label>
        </div>
      </div>
      <SummaryPanel anomalies={anomalies} totalTests={rows.length} />
      <SuspiciousTable data={anomalies} />
      <ChartsPanel anomalies={anomalies} rows={rows} />
      <RecordsTable rows={rows} />
    </div>
  );
}
