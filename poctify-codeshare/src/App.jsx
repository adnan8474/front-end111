import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
 j0t95t-codex/set-up-frontend-project-with-vite,-react,-and-tailwind-css
import Contact from './pages/Contact';
 main

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-poctifyNavy text-white">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
j0t95t-codex/set-up-frontend-project-with-vite,-react,-and-tailwind-css
            <Route path="/contact" element={<Contact />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
