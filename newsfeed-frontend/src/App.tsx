import React, { useState } from 'react';

function App() {
  const [news, setNews] = useState('');
  const [newsList, setNewsList] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!news.trim()) return;
    setNewsList([news.trim(), ...newsList]);
    setNews('');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Add News Content</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow">
        <label htmlFor="news" className="block mb-2 font-semibold text-gray-700">
          News Text
        </label>
        <textarea
          id="news"
          value={news}
          onChange={(e) => setNews(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 min-h-[150px]"
          placeholder="Paste the full news content here..."
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add News
        </button>
      </form>

      <section className="mt-10 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Added News</h2>
        {newsList.length === 0 && <p className="text-gray-600">No news added yet.</p>}
        <ul>
          {newsList.map((item, i) => (
            <li key={i} className="bg-white p-4 rounded mb-3 shadow break-words whitespace-pre-wrap">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
