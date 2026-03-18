export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

try {
const response = await fetch(
"https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
{
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": "Bearer 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",
},
body: JSON.stringify({
inputs: `ニュース「${topic}」に関連する実在する有名な本や映画を3つ教えてください。必ずJSON配列のみで返してください。形式：[{"type":"本","title":"タイトル","author":"著者名","reason":"理由"}]`,
parameters: {
max_new_tokens: 500,
temperature: 0.1,
return_full_text: false,
},
}),
}
);

const data = await response.json();
const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;

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

