export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

try {
const booksRes = await fetch(
`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(topic)}&langRestrict=ja&maxResults=5`
);
const booksData = await booksRes.json();

const recommendations = (booksData.items || []).slice(0, 5).map(b => ({
type: "本",
title: b.volumeInfo.title,
author: b.volumeInfo.authors?.[0] || "不明",
reason: `「${topic}」に関連する作品です`,
}));

res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}
