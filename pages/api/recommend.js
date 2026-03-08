export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

let topic;
try {
topic = req.body?.topic || req.body;
} catch(e) {
return res.status(400).json({ error: "リクエストエラー" });
}

if (!topic || typeof topic !== "string") {
return res.status(400).json({ error: "トピックが必要です", received: JSON.stringify(req.body) });
}

const keyword = encodeURIComponent(topic);

try {
const booksRes = await fetch(
`https://openlibrary.org/search.json?q=${keyword}&limit=5`
);
const books​​​​​​​​​​​​​​​​
