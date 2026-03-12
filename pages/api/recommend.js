export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

// タイトルから最初の10文字だけ使う
const shortKeyword = topic.slice(0, 10);

try {
const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(shortKeyword)}&maxResults=5`;
const booksRes = await fetch(url);
const booksData = await booksRes.json();

if (!booksData.items || booksData.items.length === 0) {
return res.status(200).json({ recommendations: [
{ type: "本", title: "関連する本が見つかりませんでした", author: "", reason: "別のキーワードで試してください" }
]});
}

const recommendations = booksData.items.slice(0, 5).map(b => ({
type: "本",
title: b.volumeInfo?.title || "不明",
author: b.volumeInfo?.authors?.[0] || "不明",
reason: `「${topic}」に関連する作品です`,
}));

res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}
