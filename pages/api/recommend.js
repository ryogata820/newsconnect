const keywords = {
"政治": "politics",
"経済": "economics",
"AI": "artificial intelligence",
"技術": "technology",
"環境": "environment",
"気候": "climate",
"戦争": "war",
"選挙": "election",
"医療": "medicine",
"教育": "education",
"スポーツ": "sports",
"映画": "film",
"音楽": "music",
"宇宙": "space",
"科学": "science",
};

function toEnglish(topic) {
for (const [ja, en] of Object.entries(keywords)) {
if (topic.includes(ja)) return en;
}
return "japan";
}

export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

const englishKeyword = toEnglish(topic);

try {
const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(englishKeyword)}&limit=5`;
const booksRes = await fetch(url);
const booksData = await booksRes.json();

if (!booksData.docs || booksData.docs.length === 0) {
return res.status(200).json({ recommendations: [
{ type: "本", title: "関連する本が見つかりませんでした", author: "", reason: "別のキーワードで試してください" }
]});
}

const recommendations = booksData.docs.slice(0, 5).map(b =>

