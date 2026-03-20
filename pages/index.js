import { useState, useEffect } from "react";

const AMAZON_TAG = "newsconnect-22";

const CATEGORIES = [
{ label: "トップ", query: "general" },
{ label: "国内", query: "nation" },
{ label: "国際", query: "world" },
{ label: "政治", query: "politics" },
{ label: "経済", query: "business" },
{ label: "エンタメ", query: "entertainment" },
{ label: "スポーツ", query: "sports" },
{ label: "IT・科学", query: "technology" },
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
style={{ flex: 1, padding: 8, border​​​​​​​​​​​​​​​​

