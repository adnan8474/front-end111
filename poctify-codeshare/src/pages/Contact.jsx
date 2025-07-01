import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:info@poctify.com?subject=Contact%20Us&body=${body}`;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 text-black rounded"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full p-2 text-black rounded"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 text-black rounded"
          rows="4"
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="bg-poctifyBlue text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}

