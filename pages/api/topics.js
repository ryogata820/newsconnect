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
{ id: 2, title: "AI技術の最​​​​​​​​​​​​​​​​
