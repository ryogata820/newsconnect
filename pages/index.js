import { useState, useEffect } from "react";

export default function Home() {
const [topics, setTopics] = useState([]);
const [recommendations, setRecommendations] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchText, setSearchText] = useState("");

useEffect(() => {
fetchTopics();
}, []);

const fetchTopics = async () => {
try {
const res = await fetch("/api/topics");
const data = await res.json();
if (data.topics) setTopics(data.topics);
else setError("トピックの取得に失敗しました。再試行してください。");
} catch (e) {
setError("トピックの取得に失敗しました。再試行してください。");
}
};

const fetchRecommendations = async (topicTitle) => {
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
