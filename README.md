# intern.jig.jp

## インターンシップ情報更新方法

### 募集中 / 終了したインターンを追加したいとき

- 画像を `img/` に追加する
- `src/content/internships/` に `.mdx` ファイルを 1 つ追加する

`[slug]` には、追加した `.mdx` ファイル名がそのまま使われます。

例:

- `src/content/internships/online.mdx` → `/internships/online/`
- `src/content/internships/kosen-real.mdx` → `/internships/kosen-real/`

#### MDX ファイルの中身

既存のファイルを複製して書き換えるのが楽です。

**frontmatter**

次の 5つの情報が必要です。

- `order`: 一覧に表示される順番
- `status`: `open` または `closed`
- `hasSelection`: 選考あり or なし
- `title`: タイトル
- `summary`: 一覧カードに出る説明文
- `target`: どんな人向けか
- `image`: `/img/...` 形式の画像パス

サンプル:

```mdx
---
status: "open"
title: "2026 オンラインコース"
summary: "エンジニア志望の学生向けに、Web アプリ開発を体験できる 1 週間のインターンです。"
target: "全国の学生"
image: "/img/2026_intern_online_banner.png"
---
```

**募集要項**

募集要項部分のテーブルレイアウトは以下テンプレートや既存の記述を参考にしてください。

スタイルなどを当てるために、独自のコンポーネントを使用して表を作っています

**テンプレート**

```mdx
---
status: "open"
title: "2026 オンラインコース"
summary: "エンジニア志望の学生向けに、Web アプリ開発を体験できる 1 週間のインターンです。"
target: "全国の学生"
image: "/img/2026_intern_online_banner.png"
---

import RequirementRow from "../../components/internships/RequirementRow.astro";
import RequirementsTable from "../../components/internships/RequirementsTable.astro";

<RequirementsTable>
  <RequirementRow heading="日程">2026/8/17(月) ～ 2026/8/21(金)</RequirementRow>
  <RequirementRow heading="時間">
    9:00 ～ 18:00（1日8時間、土日を除く）
  </RequirementRow>
  <RequirementRow heading="場所">オンライン</RequirementRow>
  <RequirementRow heading="報酬">日当あり</RequirementRow>
  <RequirementRow heading="エントリー期日">
    <p>2026/7/31(金) 23:59</p>
    <p class="muted-note">※ 応募状況により早めに締め切る場合があります。</p>
  </RequirementRow>
  <RequirementRow heading="選考概要">
    <ol>
      <li>エントリー受付</li>
      <li>書類選考</li>
      <li>オンライン面接</li>
      <li>合否連絡</li>
    </ol>
  </RequirementRow>
</RequirementsTable>
```

### 過去のインターンシップ情報（ブログへのリンクなど）を追加したいとき

- `src/content/pastLogs/pastLogs.json` を編集する
- 必要なら画像を `img/` に追加する
  - ブログ記事などは OGP画像をビルド時に取得するので、画像の指定は不要です。

## 過去ログの追加手順

`src/content/pastLogs/pastLogs.json` にタブごとの配列が入っており、各 items の中身には、`title` と `href`, `image`（任意） を指定できます。

例:

```json
{
  "title": "2026 インターン募集のお知らせ",
  "href": "https://example.com/news/2026-intern",
  "image": "/img/2026_intern_online_banner.png"
}
```

`image` を省略した場合は、OGP 画像が自動利用されます。

## ローカル確認

```bash
pnpm install
pnpm dev
```

## Web

https://intern.jig.jp/
