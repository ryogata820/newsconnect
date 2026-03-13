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
"Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
},
body: JSON.stringify({
model: "llama-3.3-70b-versatile",
messages: [
{
role: "user",
content: `ニュース「${topic}」に関連するおすすめの本や映画を3つ教えてください。以下の条件を必ず守ってください：
1. 世界的に有名でベストセラーになった作品のみ
2. 日本のAmazonで確実に購入できる作品のみ
3. 著者名は正確に記載すること
4. 映画は日本で公開された作品のみ
必ずJSON配列のみで返してください。形式：[{"type":"本","title":"タイトル","author":"著者名","reason":"理由"}]`,
}
],
max_tokens: 800,
temperature: 0.1,
}),
});

const data = await response.json();

if (!data.choices || data.choices.length === 0) {
throw new Error("no choices: " + JSON.stringify(data));
}

const text = data.choices[0].message.content;
const match = text.match(/\[[\s\S]*?\]/);

if (!match) {
throw new Error("no json found: " + text);
}

const recommendations = JSON.parse(match[0]);
res.status(200).json({ recommendations });
} catch (error) {
console.error("Error:", error.message);
res.status(500).json({ error: error.message });
}
}

