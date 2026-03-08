export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();
try {
const response = await fetch(
"https://rss.app/feeds/tJOGSaGdBMLpgGPw.json"
);
const data = await response.json();
const topics = data.items.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: "ニュース",
}));
res.status(200).json({ topics });
} catch (error) {
const topics = [
{ id: 1, title: "日本経済の動向", category: "経済" },
{ id: 2, title: "AI技術の最新発展", category: "技術" },
{ id: 3, title: "気候変動対策", category: "環境" },
{ id: 4, title: "宇宙開発競争", category: "科学" },
{ id: 5, title: "スポーツ最新ニュース", category: "スポーツ" },
{ id: 6, title: "映画・エンタメ情報", category: "エンタメ" },
{ id: 7, title: "健康・医療の最新情報", category: "健康" },
];
res.status(200).json({ topics });
}
}
