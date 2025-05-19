import { useEffect, useState } from 'react';
import './App.css';

const API_KEY = 'AIzaSyBUXQCC4GlJ2ra37CJDZOqCm3yH-y93unc';
const CHANNEL_ID = 'UC1H1k0GDUeZ2ADLkqpcFZow';

const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000];

function App() {
  const [subs, setSubs] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const fetchSubs = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const data = await res.json();
      setSubs(parseInt(data.items[0].statistics.subscriberCount));
    } catch (err) {
      console.error('Error fetching subscriber count:', err);
    }
  };

  useEffect(() => {
    fetchSubs();
    const interval = setInterval(fetchSubs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const nextMilestone = milestones.find((m) => subs < m) || subs;
  const progress = subs && nextMilestone ? (subs / nextMilestone) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">🎯 即時訂閱追蹤</h1>

      <p className="text-2xl mb-2">{subs ? `${subs} 訂閱者` : '載入中...'}</p>
      <p className="mb-4">下一個里程碑：{nextMilestone}</p>

      <div className="w-full max-w-lg">
        <div className="bg-gray-700 rounded-full h-6">
          <div
            className="h-6 neon-bar rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-right mt-1">{progress.toFixed(1)}%</p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition"
        onClick={() => setDarkMode(!darkMode)}
      >
        切換 {darkMode ? '淺色' : '深色'} 主題
      </button>
    </div>
  );
}

export default App;
