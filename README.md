# 配信管制室 v0.1.1

スマホ管理向けの配信用ミニ管理アプリです。

## ローカルで起動

```bash
npm install
npm run dev
```

表示されたURLをスマホで開く場合は、PCとスマホを同じWi-Fiにして、`Network` 側のURLを開いてください。

## GitHub Pages 用

```bash
npm run build
```

`dist` フォルダをGitHub Pagesに公開してください。

## 白画面対策

- `vite.config.js` に `base: './'` を入れてあります。
- GitHub Pages のサブディレクトリ公開でも読み込みやすい構成です。
- 直接 `index.html` をダブルクリックではなく、`npm run dev` か GitHub Pages で開いてください。
