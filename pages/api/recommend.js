export default async function handler(req, res) {
const topic = req.method === "POST" ? req.body?.topic : req.query?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

const keyword = encodeURIComponent(topic);

try {
const booksRes = await fetch(
`https://openlibrary.org/search.json?q=${keyword}&limit=5`
);
const booksData = await booksRes.json();

const recommendations = booksData.docs.slice(0, 5).map(b => ({
type: "本",
title: b.title,
author: b.author_name?.[0] || "不明",
reason: `「${topic}」に関連する作品です`,
}));

res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}
