export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();
const { topic } = req.body;
const keyword = encodeURIComponent(topic);
try {
const [booksRes, moviesRes] = await Promise.all([
fetch(`https://openlibrary.org/search.json?q=${keyword}&limit=3&language=jpn`),
fetch(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_TMDB_KEY&query=${keyword}&language=ja-JP`)
]);
const booksData = await booksRes.json();
const books = booksData.docs.slice(0, 3).map(b => ({
type: "本",
title: b.title,
author: b.author_name?.[0] || "不明",
reason: `「${topic}」に関連する本です`,
}));
res.status(200).json({ recommendations: books });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}
