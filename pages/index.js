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
} catch (e) {
setError("トピックの取得に失敗しました。再試行してください。");
}
};

const fetchRecommendations = async (topic) => {
setLoading(true);
setError("");
try {
const res = await fetch("/api/recommend", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ topic }),
});
const data = await res.json();
if (data.recommendations) setRecommendations(data.recommendations);
else​​​​​​​​​​​​​​​​
