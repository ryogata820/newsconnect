const recommendations_db = {
"政治": [
{ type: "本", title: "日本の政治", author: "北岡伸一", reason: "政治を理解する名著" },
{ type: "映画", title: "新聞記者", author: "藤井道人監督", reason: "政治をテーマにした映画" },
{ type: "本", title: "1984", author: "ジョージ・オーウェル", reason: "政治権力を描いた名作" },
],
"経済": [
{ type: "本", title: "21世紀の資本", author: "トマ・ピケティ", reason: "経済格差を論じた名著" },
{ type: "本", title: "国富論", author: "アダム・スミス", reason: "経済学の原点" },
{ type: "映画", title: "マネー・ショート", author: "アダム・マッケイ監督", reason: "経済危機を描いた映画" },
],
"AI": [
{ type: "本", title: "AIの衝撃", author: "小林雅一", reason: "AIの未来を解説" },
{ type: "映画", title: "her/世界でひとつの彼女", author: "スパイク・ジョーンズ監督", reason: "AIと人間を描いた映画" },
{ type: "本", title: "シンギュラリティは近い", author: "レイ・カーツワイル", reason: "AI革命の予測" },
],
"環境": [
{ type: "本", title: "沈黙の春", author: "レイチェル・カーソン", reason: "環境問題の原点" },
{ type: "映画", title: "不都合な真実", author: "アル・ゴア", reason: "気候変動を扱ったドキュメンタリー" },
{ type: "本", title: "2050年の地球", author: "ナサニエル・リッチ", reason: "環境問題の未来" },
],
"戦争": [
{ type: "本", title: "戦争と平和", author: "トルストイ", reason: "戦争を描いた不朽の名作" },
{ type: "映画", title: "火垂るの墓", author: "高畑勲監督", reason: "戦争の悲劇を描いた作品" },
{ type: "本", title: "夜と霧", author: "ヴィクトール・フランクル", reason: "戦争の記録" },
],
"スポーツ": [
{ type: "本", title: "マネーボール", author: "マイケル・ルイス", reason: "スポーツと戦略の名著" },
{ type: "映画", title: "ペレ", author: "ジェフ・ジュプナー監督", reason: "スポーツの感動作" },
{ type: "本", title: "走ることについて語るときに僕の語ること", author: "村上春樹", reason: "スポーツと人生を描く" },
],
"医療": [
{ type: "本", title: "神様のカルテ", author: "夏川草介", reason: "医療現場を描いた小説" },
{ type: "映画", title: "コンテイジョン", author: "スティーブン・ソダーバーグ監督", reason: "感染症を描いた映画" },
{ type: "本", title: "医療の倫理", author: "星野一正", reason: "医療と社会を考える" },
],"EV": [
{ type: "本", title: "イーロン・マスク", author: "ウォルター・アイザックソン", reason: "EV革命を牽引した人物の伝記" },
{ type: "映画", title: "ファスト&フュリアス", author: "ジャスティン・リン監督", reason: "自動車をテーマにした映画" },
{ type: "本", title: "トヨタ生産方式", author: "大野耐一", reason: "自動車産業を理解する名著" },
],
"ホンダ": [
{ type: "本", title: "本田宗一郎夢を力に", author: "本田宗一郎", reason: "ホンダ創業者の自伝" },
{ type: "映画", title: "フォードvsフェラーリ", author: "ジェームズ・マンゴールド監督", reason: "自動車メーカーの戦いを描いた映画" },
{ type: "本", title: "トヨタvs世界", author: "児玉博", reason: "自動車産業の競争を描く" },
],
"自動車": [
{ type: "本", title: "自動車の世紀", author: "ジェームズ・J・フリンク", reason: "自動車産業の歴史" },
{ type: "映画", title: "フォードvsフェラーリ", author: "ジェームズ・マンゴールド監督", reason: "自動車レースを描いた映画" },
{ type: "本", title: "トヨタ生産方式", author: "大野耐一", reason: "自動車産業の革新" },
],
};

function getRecommendations(topic) {
for (const [keyword, items] of Object.entries(recommendations_db)) {
if (topic.includes(keyword)) return items;
}
return [
{ type: "本", title: "サピエンス全史", author: "ユヴァル・ノア・ハラリ", reason: `「${topic}」に関連する作品です` },
{ type: "映画", title: "新聞記者", author: "藤井道人監督", reason: `「${topic}」に関連する作品です` },
{ type: "本", title: "1984", author: "ジョージ・オーウェル", reason: `「${topic}」に関連する作品です` },
];
}

export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).end();

const topic = req.body?.topic;

if (!topic) {
return res.status(400).json({ error: "トピックが必要です" });
}

const recommendations = getRecommendations(topic);
res.status(200).json({ recommendations });
}

