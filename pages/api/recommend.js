export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

try {
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.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}`,,
},
body: JSON.stringify({
model: "llama3-8b-8192",
messages: [
{
role: "user",
content: `ニュース「${topic}」に関連するおすすめの本や映画を3つ教えてください。以下のJSON形式のみで返してください：[{"type":"本または映画","title":"タイトル","author":"著者または監督名","reason":"理由を一文で"}]`,
}
],
max_tokens: 500,
}),
});

const data = await response.json();
const text = data.choices?.[0]?.message?.content || "";
const match = text.match(/\[[\s\S]*\]/);
if (!match) throw new Error("parse error");
const recommendations = JSON.parse(match[0]);
res.status(200).json({ recommendations });
} catch (error) {
console.error(error);
res.status(500).json({ error: "推薦の取得に失敗しました" });
}
}

