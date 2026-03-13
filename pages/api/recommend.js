export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

const shortKeyword = topic.slice(0, 15);

try {
const url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=7b2dd48a-d7e6-48f8-9b72-ce314a46213b&title=${encodeURIComponent(shortKeyword)}&hits=5&formatVersion=2`;
const booksRes = await fetch(url);
const booksData = await booksRes.json();

if (!booksData.Items || booksData.Items.length === 0) {
return res.status(200).json({ recommendations: [
{ type: "本", title: "関連する本が見つかりませんでした", author: "", reason: "別のキーワードで試してください" }
]});
}

const recommendations = booksData.Items.slice(0, 5).map(b => ({
type: "本",
title: b.title || "不明",
author: b.author || "不明",
reason: `「${topic}」に関連する作品です`,
}));

res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}

