import React, { useState, useEffect } from "react";

const backendUrl = "https://crisis-manager-backend.onrender.com";

type NewsItem = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [news, setNews] = useState("");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch news list from backend on mount
  useEffect(() => {
    fetchNewsList();
  }, []);

  // Fetch news helper function
  const fetchNewsList = () => {
    setLoading(true);
    fetch(`${backendUrl}/news`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((data) => setNewsList(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Add new news item
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!news.trim()) return;

    const content = news.trim();
    const title = content.split("\n")[0].slice(0, 50); // First line as title

    fetch(`${backendUrl}/add-news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add news");
        setNews("");
        fetchNewsList();
      })
      .catch((err) => console.error(err));
  }

  // Delete news item by id
  function handleDelete(id: number) {
    fetch(`${backendUrl}/news/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete news");
        setNewsList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Add News Content</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded shadow"
      >
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
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Add News
        </button>
      </form>

      <section className="mt-10 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Added News</h2>

        {loading && <p className="text-gray-600">Loading news...</p>}

        {!loading && newsList.length === 0 && (
          <p className="text-gray-600">No news added yet.</p>
        )}

        <ul>
          {newsList.map((item) => (
            <li
              key={item.id}
              className="bg-white p-4 rounded mb-3 shadow break-words whitespace-pre-wrap flex justify-between items-start"
            >
              <div>
                <strong>{item.title}</strong>
                <p>{item.content}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="ml-4 text-red-600 hover:text-red-800 font-bold"
                aria-label={`Delete news titled ${item.title}`}
                disabled={loading}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
