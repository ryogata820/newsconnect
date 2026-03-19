import { useState, useEffect } from "react";

const AMAZON_TAG = "newsconnect-22";

export default function Home() {
const [topics, setTopics] = useState([]);
const [recommendations, setRecommendations] = useState([]);
const [selectedTopic, setSelectedTopic] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchText, setSearchText] = useState("");

useEffect(() => {
fetchTopics();
const interval = setInterval(fetchTopics, 10 * 60 * 1000);
return () => clearInterval(interval);
}, []);

const fetchTopics = async () => {
try {
const res = await fetch("/api/topics");
const data = await res.json();
if (data.topics) setTopics(data.topics);
} catch (e) {
setError("トピックの取得に失敗しました");
}
};

const fetchRecommendations = async (topicTitle) => {
if (!topicTitle) return;
setSelectedTopic(topicTitle);
setLoading(true);
setError("");
setRecommendations([]);
try {
const res = await fetch("/api/recommend", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ topic: topicTitle }),
});
const data = await res.json();
if (data.recommendations) setRecommendations(data.recommendations);
else setError("おすすめの取得に失敗しました");
} catch (e) {
setError("おすすめの取得に失敗しました");
}
setLoading(false);
};

return (
<div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
<h1>📰 NewsConnect</h1>
<p style={{ color: "#666" }}>ニュースを物語で理解する。世界が少し面白くなる。</p>

<div>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<h2>話題のニュース</h2>
<button onClick={fetchTopics}>🔄 更新</button>
</div>
{error && <p style={{ color: "red" }}>{error}</p>}
{topics.map((t) => (
<div
key={t.id}
onClick={() => fetchRecommendations(t.title)}
style={{ padding: "12px 0", borderBottom: "1px solid #eee", cursor: "pointer" }}
>
<p style={{ margin: 0, fontSize: 14, color: "#000" }}>{t.title}</p>
</div>
))}
</div>

<div style={{ marginTop: 20 }}>
<h2>🔍 キーワード検索</h2>
<div style={{ display: "flex", gap: 8 }}>
<input
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
placeholder="例：AI規制、気候変動..."
style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
/>
<button onClick={() => fetchRecommendations(searchText)} style={{ padding: "8px 16px" }}>
検索
</button>
</div>
</div>

{loading && <p>⏳ AIが考え中...</p>}

{recommendations.length > 0 && (
<div style={{ marginTop: 20 }}>
<h2>おすすめ作品</h2>
<p style={{ fontSize: 12, color: "#666" }}>「{selectedTopic}」に関連する作品</p>
{recommendations.map((r, i) => (
<div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 10, borderRadius: 8 }}>
<p style={{ margin: 0, fontSize: 12, color: "#666" }}>{r.type === "本" ? "📚 本" : "🎬 映画"}</p>
<h3 style={{ margin: "4px 0" }}>{r.title}</h3>
<p style={{ margin: "0 0 4px", color: "#666" }}>{r.author}</p>
<p style={{ margin: "0 0 8px", color: "#888", fontSize: 13 }}>{r.reason}</p>
<a
href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.title + " " + r.author)}&tag=${AMAZON_TAG}`}
target="_blank"
rel="noopener noreferrer"
style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#FF9900", color: "white", borderRadius: 4, textDecoration: "none" }}
>
Amazonで見る →
</a>
</div>
))}
</div>
)}
</div>
);
}
