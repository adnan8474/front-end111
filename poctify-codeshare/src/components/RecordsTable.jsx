import React, { useState } from 'react';

export default function RecordsTable({ rows }) {
  const [page, setPage] = useState(0);
  const perPage = 100;
  const paged = rows.slice(page * perPage, (page + 1) * perPage);
  const maxPage = Math.ceil(rows.length / perPage);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm mt-4">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operator</th>
              <th>Location</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, idx) => (
              <tr key={idx} className="bg-white text-gray-800">
                <td>{r.timestampRaw}</td>
                <td>{r.operator_id}</td>
                <td>{r.location}</td>
                <td>{r.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {maxPage > 1 && (
        <div className="mt-2 space-x-2">
          <button
            className="px-2 py-1 bg-poctifyBlue text-white rounded disabled:opacity-50"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 bg-poctifyBlue text-white rounded disabled:opacity-50"
            onClick={() => setPage(Math.min(maxPage - 1, page + 1))}
            disabled={page >= maxPage - 1}
          >
            Next
          </button>
          <span>
            Page {page + 1} of {maxPage}
          </span>
        </div>
      )}
    </div>
  );
}
