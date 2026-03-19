export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

try {
const response = await fetch(
`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
contents: [{
parts: [{
text: `ニュース「${topic}」に関連する実在する有名な本や映画を3つ教えてください。必ずJSON配列のみで返してください。他の文章は不要です。形式：[{"type":"本","title":"タイトル","author":"著者名","reason":"理由"}]`
}]
}]
}),
}
);

const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) throw new Error("no text: " + JSON.stringify(data));

const match = text.match(/\[[\s\S]*?\]/);
if (!match) throw new Error("no json: " + text);

const recommendations = JSON.parse(match[0]);
res.status(200).json({ recommendations });
} catch (error) {
console.error("Error:", error.message);
res.status(500).json({ error: error.message });
}
}

