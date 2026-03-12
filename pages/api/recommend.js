export const config = {
api: {
bodyParser: true,
},
};

export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

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
year: b.first_publish_year || "不明",
reason: `「${topic}」に関連する作品です`,
}));​​​​​​​​​​​​​​​​
