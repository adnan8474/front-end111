import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-poctifyNavy text-white min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold mb-2">POCTIFY CodeShare Detector</h1>
        <p className="mb-6">Identify operator misuse using real-world POCT logs</p>
        <Link
          to="/dashboard"
          className="bg-poctifyBlue hover:bg-poctifySoft text-white font-semibold py-2 px-4 rounded"
        >
          Launch Dashboard
        </Link>
      </div>
    </div>
  );
}
