const TOPIC_MAP = {
general: null,
nation: "nation",
world: "world",
politics: "nation",
business: "business",
entertainment: "entertainment",
sports: "sports",
technology: "technology",
};

export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();

const category = req.query.category || "general";
const topic = TOPIC_MAP[category];

try {
const url = topic
? `https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&max=7&topic=${topic}&apikey=${process.env.GNEWS_API_KEY}`
: `https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&max=7&apikey=${process.env.GNEWS_API_KEY}`;

const response = await fetch(url);
const data = await response.json();
const articles = data.articles || [];
if (articles.length === 0) throw new Error("no articles");

const topics = articles.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: category,
}));
return res.status(200).json({ topics });
} catch (error) {
console.error("Error:", error.message);
res.status(500).json({ error: error.message });
}
}

