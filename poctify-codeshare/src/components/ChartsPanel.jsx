import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import OperatorDetailsModal from './OperatorDetailsModal';
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

export default function ChartsPanel({ anomalies, rows }) {
  const [selected, setSelected] = useState(null);

  const top = [...anomalies]
    .sort((a, b) => b.tests - a.tests)
    .slice(0, 10);

  const barData = {
    labels: top.map(a => a.operator_id),
    datasets: [
      {
        label: 'Tests',
        data: top.map(a => a.tests),
        backgroundColor: '#1E40AF',
      },
    ],
  };

  const barOptions = {
    plugins: {
      title: { display: true, text: 'Top 10 Operators by Test Volume' },
      tooltip: {
        callbacks: {
          label: ctx => `Operator: ${ctx.label} — Tests: ${ctx.parsed.y}`,
        },
      },
      legend: { display: false },
    },
    onClick: (_, elements) => {
      if (elements.length) {
        const idx = elements[0].index;
        setSelected(top[idx].operator_id);
      }
    },
    scales: {
      x: { title: { display: true, text: 'Operator ID' } },
      y: { title: { display: true, text: 'Number of Tests Performed' } },
    },
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
    datasets: [
      {
        label: 'Tests',
        data: hourly,
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30,64,175,0.3)',
      },
    ],
  };

  const lineOptions = {
    plugins: {
      title: { display: true, text: 'Hourly Test Volume Across All Operators' },
      tooltip: {
        callbacks: {
          label: ctx => `Hour: ${ctx.label} — Tests: ${ctx.parsed.y}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Hour of Day (0–23)' } },
      y: { title: { display: true, text: 'Test Count' } },
    },
  };

  const scoreData = {
    labels: anomalies.map(a => a.operator_id),
    datasets: [
      {
        label: 'Suspicion Score',
        data: anomalies.map(a => a.totalScore),
        backgroundColor: anomalies.map(a => (a.suspicious ? '#DC2626' : '#1E40AF')),
      },
    ],
  };

  const scoreOptions = {
    plugins: {
      title: { display: true, text: 'Suspicion Scores per Operator' },
      tooltip: {
        callbacks: {
          label: ctx => `Score: ${ctx.parsed.y} — Suspicious: ${anomalies[ctx.dataIndex].suspicious ? 'Yes' : 'No'}`,
        },
      },
      legend: { display: false },
    },
    onClick: (_, elements) => {
      if (elements.length) {
        const idx = elements[0].index;
        setSelected(anomalies[idx].operator_id);
      }
    },
    scales: {
      x: { title: { display: true, text: 'Operator ID' } },
      y: { title: { display: true, text: 'Suspicion Score' } },
    },
  };

  const summary = selected
    ? anomalies.find(a => a.operator_id === selected)
    : null;

  return (
    <div className="space-y-4">
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="h-64 w-full bg-white p-2 rounded shadow-md">
        <Bar data={scoreData} options={scoreOptions} />
      </div>
      <OperatorDetailsModal
        open={!!selected}
        onClose={() => setSelected(null)}
        operatorId={selected}
        rows={rows}
        summary={summary}
      />
    </div>
  );
}
