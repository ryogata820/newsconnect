import { useState, useEffect } from "react";

const AMAZON_TAG = "newsconnect-22";

const CATEGORIES = [
{ label: "トップ", query: "general" },
{ label: "国内", query: "nation" },
{ label: "国際", query: "world" },
{ label: "経済", query: "business" },
{ label: "エンタメ", query: "entertainment" },
{ label: "スポーツ", query: "sports" },
{ label: "IT・科学", query: "technology" },
{ label: "政治", query: "politics" },
];

export default function Home() {
const [topics, setTopics] = useState([]);
const [recommendations, setRecommendations] = useState([]);
const [selectedTopic, setSelectedTopic] = useState(null);
const [selectedCategory, setSelectedCategory] = useState("general");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchText, setSearchText] = useState("");

useEffect(() => {
fetchTopics(selectedCategory);
}, [selectedCategory]);

const fetchTopics = async (category) => {
try {
const res = await fetch("/api/topics?category=" + category);
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
<div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#ffffff" }}>
<div style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
<h1 style={{ margin: 0, fontSize: 22, color: "#333333" }}>NewsConnect</h1>
<p style={{ margin: "4px 0 0", color: "#666666", fontSize: 13 }}>ニュースを物語で理解する。世界が少し面白くなる。</p>
</div>

<div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #eee", padding: "0 8px", backgroundColor: "#ffffff" }}>
{CATEGORIES.map((cat) => (
<button
key={cat.query}
onClick={() => setSelectedCategory(cat.query)}
style={{
padding: "12px 16px",
border: "none",
borderBottom: selectedCategory === cat.query ? "3px solid #e74c3c" : "3px solid transparent",
background: "none",
cursor: "pointer",
fontSize: 13,
fontWeight: selectedCategory === cat.query ? "bold" : "normal",
color: selectedCategory === cat.query ? "#e74c3c" : "#666666",
whiteSpace: "nowrap",
}}
>
{cat.label}
</button>
))}
</div>

<div style={{ padding: 16, backgroundColor: "#ffffff" }}>
{error && <p style={{ color: "red" }}>{error}</p>}
{topics.map((t) => (
<div
key={t.id}
onClick={() => fetchRecommendations(t.title)}
style={{ padding: "12px 0", borderBottom: "1px solid #eeeeee", cursor: "pointer" }}
>
<p style={{ margin: 0, fontSize: 14, color: "#333333", lineHeight: 1.5 }}>{t.title}</p>
</div>
))}
</div>

<div style={{ padding: "0 16px 16px", backgroundColor: "#ffffff" }}>
<div style={{ display: "flex", gap: 8 }}>
<input
value={searchText}
onChange={(e) => setSearchText(e.target.value)}
placeholder="キーワードで検索..."
style={{ flex: 1, padding: 8, border: "1px solid #dddddd", borderRadius: 4, fontSize: 14, color: "#333333" }}
/>
<button
onClick={() => fetchRecommendations(searchText)}
style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
>
検索
</button>
</div>
</div>

{loading && <p style={{ textAlign: "center", color: "#666666" }}>AIが考え中...</p>}

{recommendations.length > 0 && (
<div style={{ padding: "0 16px 16px", backgroundColor: "#ffffff" }}>
<h2 style={{ fontSize: 16, color: "#333333" }}>おすすめ作品</h2>
<p style={{ fontSize: 12, color: "#666666" }}>{selectedTopic}に関連する作品</p>
{recommendations.map((r, i) => (
<div key={i} style={{ border: "1px solid #eeeeee", padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: "#ffffff" }}>
<p style={{ margin: 0, fontSize: 12, color: "#666666" }}>{r.type === "本" ? "本" : "映画"}</p>
<h3 style={{ margin: "4px 0", color: "#333333" }}>{r.title}</h3>
<p style={{ margin: "0 0 4px", color: "#666666", fontSize: 13 }}>{r.author}</p>
<p style={{ margin: "0 0 8px", color: "#888888", fontSize: 13 }}>{r.reason}</p>
<a
href={"https://www.amazon.co.jp/s?k=" + encodeURIComponent(r.title + " " + r.author) + "&tag=" + AMAZON_TAG}
target="_blank"
rel="noopener noreferrer"
style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#FF9900", color: "white", borderRadius: 4, textDecoration: "none", fontSize: 13 }}
>
Amazonで見る
</a>
</div>
))}
</div>
)}
</div>
);
}

