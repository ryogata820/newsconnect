export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

const recommendations = [
{ type: "本", title: "1984", author: "ジョージ・オーウェル", reason: `「${topic}」に関連する作品です` },
{ type: "本", title: "銃・病原菌・鉄", author: "ジャレド・ダイアモンド", reason: `「${topic}」に関連する作品です` },
{ type: "映画", title: "新聞記者", author: "藤井道人監督", reason: `「${topic}」に関連する作品です` },
{ type: "本", title: "サピエンス全史", author: "ユヴァル・ノア・ハラリ", reason: `「${topic}」に関連する作品です` },
{ type: "映画", title: "新聞記者", author: "藤井道人監督", reason: `「${topic}」に関連する作品です` },
];

res.status(200).json({ recommendations });
}

