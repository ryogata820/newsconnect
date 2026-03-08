export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();
const { topic } = req.body;
if (!topic) return res.status(400).json({ error: "トピックが必要です" });

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
}));

if (recommendations.length === 0) {
return res.status(200).json({
recommendations: [{
type: "本",
title: "関連する作品が見つかりませんでした",
author: "",
reason: "別のキーワードで試してください",
}]
});
}

res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}
