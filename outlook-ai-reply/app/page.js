'use client';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setReply('');
    const res = await fetch('/api/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setReply(data.reply || data.error);
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Outlook AI Reply</h1>
      <textarea 
        className="w-full h-40 p-4 border rounded-lg mb-4"
        placeholder="Email paste karo yahan..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button 
        onClick={generateReply}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Reply'}
      </button>
      {reply && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">AI Reply:</h3>
          <p className="whitespace-pre-wrap">{reply}</p>
        </div>
      )}
    </main>
  );
}
