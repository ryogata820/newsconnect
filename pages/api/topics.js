export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).end();

const category = req.query.category || "general";

try {
const response = await fetch(
`https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&max=20&apikey=${process.env.GNEWS_API_KEY}`
);
const data = await response.json();
if (!data.articles || data.articles.length === 0) throw new Error("no articles");

if (category === "general") {
const topics = data.articles.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: "general",
}));
return res.status(200).json({ topics });
}

const categoryMap = {
nation: "国内",
world: "国際",
politics: "政治",
business: "経済",
entertainment: "エンタメ",
sports: "スポーツ",
technology: "IT・科学",
};

const geminiResponse = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [{
parts: [{
text: `以下のニュース記事タイトルを「国内」「国際」「政治」「経済」「エンタメ」「スポーツ」「IT・科学」のいずれかに分類してください。各記事番号とカテゴリーをJSON形式で返してください。例：{"0":"国内","1":"政治"}
${data.articles.map((a, i) => `${i}: ${a.title}`).join("\n")}`
}]
}]
}),
}
);

const geminiData = await geminiResponse.json();
const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
const match = text.match(/\{[\s\S]*?\}/);
const classified = match ? JSON.parse(match[0]) : {};

const targetCategory = categoryMap[category];
const filtered = data.articles.filter((_, i) => classified[i] === targetCategory);

const topics = filtered.slice(0, 7).map((item, i) => ({
id: i + 1,
title: item.title,
category: category,
}));

res.status(200).json({ topics });
} catch (error) {
console.error(error);
res.status(500).json({ error: "トピックの取得に失敗しました" });
}
}

