import { useState, useEffect } from "react";

const AMAZON_TAG = "newsconnect-22";

export default function Home() {
const [topics, setTopics] = useState([]);
const [recommendations, setRecommendations] = useState([]);
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
<p>ニュースから物語を発見する</p>

<div>
<h2>話題のトピック</h2>
{error && <p style={{ color: "red" }}>{error}</p>}
{topics.map((t) => (
<button
key={t.id}
onClick={() => fetchRecommendations(t.title)}
style={{ display: "block", width: "100%", margin: "5px 0", padding: 10, cursor: "pointer", textAlign: "left" }}
>
{t.title}
</button>
))}
<button onClick={fetchTopics} style={{ marginTop: 10 }}>🔄 更新</button>
</div>

<div style={{ marginTop: 20 }}>
<h2>🔍 キーワード検索</h2>
<input
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
placeholder="例：AI規制、気候変動..."
style={{ width: "80%", padding: 8 }}
/>
<button
onClick={() => fetchRecommendations(searchText)}
style={{ padding: 8, marginLeft: 5 }}
>
検索
</button>
</div>

{loading && <p>⏳ AIが考え中...</p>}

{recommendations.length > 0 && (
<div style={{ marginTop: 20 }}>
<h2>おすすめ作品</h2>
{recommendations.map((r, i) => (
<div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10, borderRadius: 8 }}>
<p>{r.type === "本" ? "📚" : "🎬"} {r.type}</p>
<h3>{r.title}</h3>
<p>{r.author}</p>
<p style={{ color: "#666" }}>{r.reason}</p>
<a
href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.title)}&tag=${AMAZON_TAG}`}
target="_blank"
rel="noopener noreferrer"
style={{ display: "inline-block", marginTop: 8, padding: "6px 12px", backgroundColor: "#FF9900", color: "white", borderRadius: 4, textDecoration: "none" }}
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
