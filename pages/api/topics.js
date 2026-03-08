export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();
try {
const response = await fetch("https://www3.nhk.or.jp/rss/news/cat0.xml");
const text = await response.text();
const items = [...text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)]
.slice(1, 8)
.map((m, i) => ({
id: i + 1,
title: m[1],
category: "ニュース",
}));
if (items.length === 0) throw new Error("no items");
res.status(200).json({ topics: items });
} catch (error) {
console.error(error);
res.status(500).json({ error: "トピックの取得に失敗しました" });
}
}
