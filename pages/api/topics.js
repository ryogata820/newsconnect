export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk-ant-api03-zfDiU09MvH8AYbh39A15jXfmbKyT3XNE70q64G4vp9oe9aOyxTdxZrNTfMXobE07jK09OIKkyMJDIvQ7ryv5qg-7eJR9gAA",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `現在の日本と世界で注目されているニューストピックを7件挙げてください。JSONの配列だけを返してください（前後の説明やコードブロック記号は不要）:
[{"id":1,"title":"トピック名25文字以内","category":"政治か経済か社会か技術か文化か国際のどれか"}]`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

    const data = await response.json();
    const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error("JSON parse failed");

    const topics = JSON.parse(match[0]);
    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "トピックの取得に失敗しました" });
  }
}
