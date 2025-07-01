import React, { useState } from 'react';
import { downloadCSV } from '../utils/exporter';

export default function SuspiciousTable({ data }) {
  const [sortKey, setSortKey] = useState('totalScore');
  const [desc, setDesc] = useState(true);
  const [filter, setFilter] = useState(0);

  const sorted = [...data]
    .filter(r => r.totalScore >= filter)
    .sort((a, b) => {
      const res = a[sortKey] > b[sortKey] ? 1 : -1;
      return desc ? -res : res;
    });

  const toggleSort = key => {
    if (key === sortKey) setDesc(!desc);
    else {
      setSortKey(key);
      setDesc(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <input
          type="number"
          value={filter}
          onChange={e => setFilter(Number(e.target.value))}
          className="text-black p-1 mr-2"
          placeholder="Min score"
        />
        <button
          className="bg-poctifyBlue px-2 py-1 rounded"
          onClick={() => downloadCSV(sorted, 'suspicious.csv')}
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="cursor-pointer">
            <tr>
              <th onClick={() => toggleSort('operator_id')}>Operator ID</th>
              <th onClick={() => toggleSort('tests')}>Tests</th>
              <th onClick={() => toggleSort('totalScore')}>Total Score</th>
              <th onClick={() => toggleSort('avgScore')}>Avg Score</th>
              <th onClick={() => toggleSort('bursts')}>Bursts</th>
              <th onClick={() => toggleSort('peakHour')}>Peak Hour</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr
                key={row.operator_id}
                className={
                  row.avgScore > 10
                    ? 'bg-red-200 text-gray-800'
                    : row.avgScore > 5
                    ? 'bg-yellow-200 text-gray-800'
                    : 'bg-green-200 text-gray-800'
                }
              >
                <td>{row.operator_id}</td>
                <td>{row.tests}</td>
                <td>{row.totalScore}</td>
                <td>{row.avgScore.toFixed(2)}</td>
                <td>{row.bursts}</td>
                <td>{row.peakHour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
