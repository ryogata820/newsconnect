"sk-ant-api03-zfDiU09MvH8AYbh39A15jXfmbKyT3XNE70q64G4vp9oe9aOyxTdxZrNTfMXobE07jK09OIKkyMJDIvQ7ryv5qg-7eJR9gAA"export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, category } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });

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
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `トピック「${title}」（分野：${category || "一般"}）に関連する映画・小説・ドラマを5作品おすすめしてください。
JSONの配列だけを返してください（前後の説明やコードブロック記号は不要）:
[{"title":"作品タイトル","type":"映画か小説かドラマのどれか","author":"監督名または著者名","year":"公開・出版年","match":関連度0から100の数値,"reason":"おすすめ理由100文字程度","connection":"このトピックとの具体的な接点50文字程度"}]`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

    const data = await response.json();
    const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("JSON parse failed");

    const recommendations = JSON.parse(match[0]);
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "おすすめの取得に失敗しました" });
  }
}
