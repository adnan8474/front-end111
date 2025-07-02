import React, { useState, useEffect } from 'react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-800/90 backdrop-blur-sm py-2' : 'bg-transparent py-4'}`}>\
      <nav className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {/* Place your logo file in the public folder as poctify-logo.png */}
          <img src="/poctify-logo.png" alt="POCTIFY logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold">POCTIFY Interactive Tools</h1>
            <p className="text-sm text-teal-300">Smarter diagnostics. One tool at a time.</p>
          </div>
        </div>
        <ul className="flex space-x-4 font-semibold">
          <li><a href="https://poctify.com" className="hover:text-teal-400">← Back to POCTIFY</a></li>
          <li><a href="#tools" className="hover:text-teal-400">Tools</a></li>
          <li><a href="#about" className="hover:text-teal-400">About</a></li>
          <li><a href="#suggest" className="hover:text-teal-400">Suggest a Tool</a></li>
        </ul>
      </nav>
    </header>
  );
}

function ToolCard({ icon, title, description, status, url }) {
  const isLive = status === 'Live';
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition">
      <div className="text-teal-300 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-4 h-10">{description}</p>
      <span className={`inline-block px-2 py-1 rounded-full text-xs mb-4 ${isLive ? 'bg-green-600' : 'bg-gray-600'}`}>{status}</span>
      <div>
        {isLive ? (
          <a href={url} className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition">Open Tool</a>
        ) : (
          <button disabled className="inline-block bg-gray-700 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed">{status === 'Coming Soon' ? 'Coming Soon' : 'Beta'}</button>
        )}
      </div>
    </div>
  );
}

function ToolsSection() {
  const tools = [
    {
      icon: '🔍',
      title: 'Barcode Sharing Detector Demo',
      description: 'Analyse POCT logs to flag suspected barcode sharing across devices and users.',
      status: 'Live',
      url: 'https://codeshare.poctify.com/'
    },
    {
      icon: '📈',
      title: 'Live EQA Monitor Demo',
      description: 'Predict QC or EQA failures across blood gas devices before WEQAS results arrive, using device pattern comparison.',
      status: 'Live',
      url: 'https://eqaudit.poctify.com/'
    },
    {
      icon: '🤖',
      title: 'POCTIFY AI Desk',
      description: 'Ask anything. Answered instantly. From SOPs to standards.',
      status: 'Coming Soon',
      url: '#'
    },
    {
      icon: '💡',
      title: 'Suggest a Tool',
      description: 'Got an idea for a POCT tool? We’d love to hear it.',
      status: 'Live',
      url: '#suggest'
    }
  ];

  return (
    <section id="tools" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Tools</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, idx) => (
          <ToolCard key={idx} {...tool} />
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-gray-300 mb-6 max-w-3xl">POCTIFY Interactive is our digital sandbox – a space to prototype, test, and deploy tools that make near-patient diagnostics smarter and faster. Every tool is built with ISO 15189:2022 compliance and NHS workflows in mind.</p>
        <span className="inline-block bg-teal-600 px-3 py-1 rounded-full text-sm">Built by POCT professionals, for POCT professionals</span>
      </div>
    </section>
  );
}

function SuggestSection() {
  const [open, setOpen] = useState(false);
  return (
    <section id="suggest" className="py-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4">Suggest a Tool</h2>
      <button onClick={() => setOpen(!open)} className="mb-4 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md">{open ? 'Hide Form' : 'Show Form'}</button>
      {open && (
        <form
          action="https://formspree.io/f/mblyqwgj"
          method="POST"
          className="space-y-4"
        >
          <div>
            <label className="block mb-1" htmlFor="name">Name</label>
            <input name="name" id="name" type="text" required className="w-full px-3 py-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input name="email" id="email" type="email" required className="w-full px-3 py-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="idea">Tool Idea *</label>
            <textarea name="idea" id="idea" required className="w-full px-3 py-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="usecase">Use Case</label>
            <textarea name="usecase" id="usecase" className="w-full px-3 py-2 bg-gray-700 rounded" />
          </div>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md text-white">Submit</button>
        </form>
      )}
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-gray-800 py-6 text-center text-sm">
      <p className="mb-2">© 2025 POCTIFY Ltd – Designed for POCT Professionals.</p>
      <div className="space-x-4">
        <a href="https://www.linkedin.com/company/poctsolution" aria-label="LinkedIn" className="hover:text-teal-400">LinkedIn</a>
        <a href="mailto:info@poctify.com" aria-label="Email" className="hover:text-teal-400">Email</a>
      </div>
      <p className="mt-2 text-gray-400">Built by POCTIFY LTD ❤️ </p>
    </footer>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 right-6 p-3 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition ${visible ? 'block' : 'hidden'}`}>↑</button>
  );
}

function CookieBanner() {
  const [accepted, setAccepted] = useState(() => localStorage.getItem('cookiesAccepted') === 'true');
  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setAccepted(true);
  };
  if (accepted) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-200 p-4 text-sm flex items-center justify-between z-50 shadow-md">
      <span>This site uses cookies to improve your experience. No personal data is collected.</span>
      <button onClick={handleAccept} className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded ml-4">Accept</button>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Header />
      <main className="pt-24">
        <ToolsSection />
        <AboutSection />
        <SuggestSection />
      </main>
      <FooterSection />
      <ScrollTopButton />
      <CookieBanner />
    </div>
  );
}
