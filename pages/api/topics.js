const CATEGORY_KEYWORDS = {
general: "",
nation: "日本",
world: "海外　国際ニュース",
politics: "政治",
business: "経済",
entertainment: "エンタメ",
sports: "スポーツ",
technology: "AI テクノロジー IT",
};

export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();

const category = req.query.category || "general";
const keyword = CATEGORY_KEYWORDS[category] || "";

try {
const url = keyword
? `https://gnews.io/api/v4/search?q=${encodeURIComponent(keyword)}&lang=ja&country=jp&max=7&apikey=${process.env.GNEWS_API_KEY}`
: `https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&max=7&apikey=${process.env.GNEWS_API_KEY}`;

const response = await fetch(url);
const data = await response.json();
if (!data.articles || data.articles.length === 0) throw new Error("no articles");
const topics = data.articles.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: category,
}));
res.status(200).json({ topics });
} catch (error) {
console.error(error);
res.status(500).json({ error: "トピックの取得に失敗しました" });
}
}

