const CATEGORIES = [
{ label: "トップ", query: "general" },
{ label: "国内", query: "nation" },
{ label: "国際", query: "world" },
{ label: "経済", query: "business" },
{ label: "エンタメ", query: "entertainment" },
{ label: "スポーツ", query: "sports" },
{ label: "IT・科学", query: "technology" },
];

export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();

const category = req.query.category || "general";

try {
const response = await fetch(
`https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&topic=${category}&max=7&apikey=${process.env.GNEWS_API_KEY}`
);
const data = await response.json();
if (!data.articles || data.articles.length === 0) throw new Error("no articles");
const topics = data.articles.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: CATEGORIES.find(c => c.query === category)?.label || "ニュース",
}));
res.status(200).json({ topics, categories: CATEGORIES });
} catch (error) {
console.error(error);
res.status(500).json({ error: "トピックの取得に失敗しました" });
}
}

