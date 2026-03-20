import { useState, useEffect } from "react";

const AMAZON_TAG = "あなたのアソシエイトID";

const CATEGORIES = [
{ label: "トップ", query: "general" },
{ label: "国内", query: "nation" },
{ label: "国際", query: "world" },
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
const res = await fetch(`/api/topics?category=${category}`);
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
<div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
<div style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
<h1 style={{ margin: 0, fontSize: 22 }}>📰 NewsConnect</h1>
<p style={{ margin: "4px 0

