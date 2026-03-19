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
<div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
<div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 16 }}>
<h1 style={{ margin: 0, fontSize: 24 }}>📰 NewsConnect</h1>
<p style={{ margin: "4px 0 0", color: "#666" }}>ニュースを物語で理解する。世界が少し面白くなる。</p>
</div>

<div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 16 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
<h2 style={{ margin: 0, fontSize: 18 }}>話題のニュース</h2>
<button onClick={fetchTopics} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>🔄 更新</button>
</div>
{error && <p style={{ color: "red" }}>{error}</p>}
{topics.map((t) => (
<div
key={t.id}
onClick={() => fetchRecommendations(t.title)}
style={{ padding: "12px 0", borderBottom: "1px solid #eee", cursor: "pointer" }}
>
<span style={{ fontSize: 11, color: "#fff", backgroundColor: "#e74c3c", padding: "2px 8px", borderRadius: 4, marginBottom: 6, display: "inline-block" }}>
{t.category}
</span>
<p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.5 }}>{t.title}</p>
</div>
))}
</div>

<div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 16 }}>
<h2 style={{ margin: "0 0 12px", fontSize: 18 }}>🔍 キーワード検索</h2>
<div style={{ display: "flex", gap: 8 }}>
<input
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
placeholder="例：AI規制、気候変動..."
style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 14 }}
/>
<button
onClick={() => fetchRecommendations(searchText)}
style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
>
検索
</button>
</div>
</div>

{loading && (
<div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12, textAlign: "center", color: "#666" }}>
⏳ AIが考え中...
</div>
)}

{recommendations.length > 0 && (
<div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12 }}>
<h2 style={{ margin: "0 0 12px", fontSize: 18 }}>おすすめ作品</h2>
<p style={{ margin: "0 0 12px", fontSize: 12, color: "#666" }}>「{selectedTopic}」に関連する作品</p>
{recommendations.map((r, i) => (
<div key={i} style={{ padding: "12px 0", borderBottom: i < recommendations.length - 1 ? "1px solid #eee" : "none" }}>
<span style={{ fontSize: 11, color: "#fff", backgroundColor: r.type === "本" ? "#27ae60" : "#8e44ad", padding: "2px 8px", borderRadius: 4 }}>
{r.type === "本" ? "📚 本" : "🎬 映画"}
</span>
<h3 style={{ margin: "8px 0 4px", fontSize: 16 }}>{r.title}</h3>
<p style={{ margin: "0 0 4px", fontSize: 13, color: "#666" }}>{r.author}</p>
<p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>{r.reason}</p>
<a
href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.title + " " + r.author)}&tag=${AMAZON_TAG}`}
target="_blank"
rel="noopener noreferrer"
style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#FF9900", color: "white", borderRadius: 4, textDecoration: "none", fontSize: 13 }}
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
