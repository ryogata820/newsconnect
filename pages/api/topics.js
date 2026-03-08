export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();
try {
const response = await fetch(
"https://newsapi.org/v2/top-headlines?country=jp&pageSize=7&apiKey=YOUR_NEWS_API_KEY",
{ headers: { "X-Api-Key": "YOUR_NEWS_API_KEY" } }
);
const data = await response.json();
console.log("NewsAPI response:", JSON.stringify(data));
if (!data.articles || data.articles.length === 0) throw new Error("no articles: " + data.message);
const topics = data.articles.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: "ニュース",
}));
res.status(200).json({ topics });
} catch (error) {
console.error(error);
res.status(500).json({ error: error.message });
}
}
