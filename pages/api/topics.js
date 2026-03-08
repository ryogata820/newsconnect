export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();
try {
const response = await fetch(
"https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtcGhHZ0pLVWlnQVAB?hl=ja&gl=JP&ceid=JP:ja"
);
const text = await response.text();
const items = [...text.matchAll(/<title>(.*?)<\/title>/g)]
.slice(1, 8)
.map((m, i) => ({
id: i + 1,
title: m[1].replace(/<[^>]*>/g, ""),
category: "ニュース",
}));
res.status(200).json({ topics: items });
} catch (error) {
console.error(error);
res.status(500).json({ error: "トピックの取得に失敗しました" });
}
}
