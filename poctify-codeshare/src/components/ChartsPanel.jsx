import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ChartsPanel({ anomalies }) {
  const top = [...anomalies]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  const barData = {
    labels: top.map(a => a.operator_id),
    datasets: [
      { label: 'Total Score', data: top.map(a => a.totalScore), backgroundColor: '#1E40AF' },
    ],
  };

  const hourly = Array(24).fill(0);
  anomalies.forEach(a => {
    if (a.hourlyCounts) {
      Object.entries(a.hourlyCounts).forEach(([h, c]) => {
        hourly[h] += c;
      });
    }
  });

  const lineData = {
    labels: hourly.map((_, i) => i),
    datasets: [{ label: 'Tests', data: hourly, borderColor: '#1E40AF' }],
  };

  const scoreData = {
    labels: anomalies.map(a => a.operator_id),
    datasets: [
      {
        label: 'Avg Score',
        data: anomalies.map(a => a.avgScore),
        backgroundColor: anomalies.map(a => (a.suspicious ? '#DC2626' : '#1E40AF')),
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
      </div>
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Line data={lineData} options={{ plugins: { legend: { display: false } } }} />
      </div>
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Bar data={scoreData} options={{ plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}
