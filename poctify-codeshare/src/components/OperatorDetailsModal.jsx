import React from 'react';

export default function OperatorDetailsModal({ open, onClose, operatorId, rows, summary }) {
  if (!open) return null;

  const operatorRows = rows.filter(r => r.operator_id === operatorId);
  const hourly = {};
  operatorRows.forEach(r => {
    const h = r.timestamp.getHours();
    hourly[h] = (hourly[h] || 0) + 1;
  });
  const locations = Array.from(new Set(operatorRows.map(r => r.location)));
  const devices = Array.from(new Set(operatorRows.map(r => r.device)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 p-4 rounded shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">Operator {operatorId}</h3>
        {summary && (
          <div className="mb-2 space-y-1">
            <p>Suspicion Score: {summary.totalScore}</p>
            <p>Average Score: {summary.avgScore.toFixed(2)}</p>
            <p>Bursts: {summary.bursts}</p>
            <p>Night Shift %: {(summary.nightShiftPct * 100).toFixed(0)}%</p>
            <div>
              <span className="font-semibold">Breakdown:</span>
              <ul className="list-disc ml-5">
                {Object.entries(summary.breakdown).map(([k, v]) =>
                  v ? <li key={k}>{k}: {v}</li> : null
                )}
              </ul>
            </div>
          </div>
        )}
        <p className="font-semibold mt-2">Locations: {locations.join(', ')}</p>
        <p className="font-semibold">Devices: {devices.join(', ')}</p>
        <div className="mt-2">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1">Timestamp</th>
                <th className="px-2 py-1">Location</th>
                <th className="px-2 py-1">Device</th>
              </tr>
            </thead>
            <tbody>
              {operatorRows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">{r.timestampRaw}</td>
                  <td className="px-2 py-1">{r.location}</td>
                  <td className="px-2 py-1">{r.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-4 px-3 py-1 bg-poctifyBlue text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
