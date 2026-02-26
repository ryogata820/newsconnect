# 📡 NewsConnect

ニュースに関連した映画・小説・ドラマをAIがおすすめするWebサービスです。

## Vercelへのデプロイ手順

### 1. GitHubにアップロード

1. [github.com](https://github.com) でアカウント作成
2. 「New repository」でリポジトリを作成（名前：newsconnect）
3. このフォルダの中身をアップロード

### 2. Vercelと連携

1. [vercel.com](https://vercel.com) でアカウント作成（GitHubでログイン）
2. 「Add New Project」→ GitHubのnewsconnectを選択
3. 「Deploy」ボタンを押す

### 3. APIキーを設定

1. Vercelのプロジェクトページ → Settings → Environment Variables
2. 以下を追加：
   - Name: `ANTHROPIC_API_KEY`
   - Value: Anthropicのダッシュボードで取得したAPIキー
3. 「Save」→「Redeploy」

### 4. 完成！

`https://your-project.vercel.app` でアクセスできます。

## ローカルで動かす場合

```bash
# 依存パッケージをインストール
npm install

# .env.local.exampleをコピーしてAPIキーを設定
cp .env.local.example .env.local
# .env.local を編集してAPIキーを入力

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアクセスできます。

## APIキーの取得方法

1. [console.anthropic.com](https://console.anthropic.com) でアカウント作成
2. 「API Keys」→「Create Key」
3. 表示されたキーをコピー（一度しか表示されないので注意）

## ファイル構成

```
newsconnect/
├── pages/
│   ├── index.js          # メイン画面
│   ├── _app.js           # アプリ設定
│   └── api/
│       ├── topics.js     # ニューストピック取得API
│       └── recommend.js  # おすすめ生成API
├── styles/
│   └── globals.css       # グローバルスタイル
├── .env.local.example    # 環境変数テンプレート
└── package.json
```
