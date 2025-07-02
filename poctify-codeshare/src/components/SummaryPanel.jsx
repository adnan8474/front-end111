import React from 'react';

export default function SummaryPanel({ anomalies, totalTests }) {
  const suspicious = anomalies.filter(a => a.suspicious).length;
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-white text-gray-800 rounded shadow-md">
        <p className="text-sm">Operators</p>
        <p className="text-xl font-bold">{anomalies.length}</p>
      </div>
      <div className="p-4 bg-white text-gray-800 rounded shadow-md">
        <p className="text-sm">Suspicious</p>
        <p className="text-xl font-bold">{suspicious}</p>
      </div>
      <div className="p-4 bg-white text-gray-800 rounded shadow-md">
        <p className="text-sm">Total Tests</p>
        <p className="text-xl font-bold">{totalTests}</p>
      </div>
    </div>
  );
}
