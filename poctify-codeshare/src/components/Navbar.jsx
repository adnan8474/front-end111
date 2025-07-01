import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-poctifyBlue text-white p-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="POCTIFY" className="h-8" />
        <span className="font-semibold">POCTIFY</span>
      </Link>
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <ul className={`md:flex space-x-4 ${open ? 'block' : 'hidden md:block'}`}>
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><a href="#" className="hover:underline">About</a></li>
 j0t95t-codex/set-up-frontend-project-with-vite,-react,-and-tailwind-css
        <li><Link to="/contact" className="hover:underline">Contact</Link></li>

        <li><a href="#" className="hover:underline">Contact</a></li>
 main
      </ul>
    </nav>
  );
}
