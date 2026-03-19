export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

try {
const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
"HTTP-Referer": "https://newsconnect-fzxz.vercel.app",
"X-Title": "NewsConnect",
},
body: JSON.stringify({
model: "meta-llama/llama-3.1-8b-instruct:free",
messages: [{
role: "user",
content: `ニュース「${topic}」に関連する実在する有名な本や映画を3つ教えてください。必ずJSON配列のみで返してください。形式：[{"type":"本","title":"タイトル","author":"著者名","reason":"理由"}]`,
}],
max_tokens: 500,
}),
}
);

const data = await response.json();
const text = data.choices?.[0]?.message?.content;

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

