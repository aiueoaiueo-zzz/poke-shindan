# ポロック相性診断アプリ 🎮

「もしもポケモン世界に迷い込んだら？」という18問の質問に答えて、18タイプのうち自分のタイプを診断し、友達との相性をチェックできる Next.js アプリです。

## 使い方の流れ

1. トップページでホストがニックネームを入力 → 部屋が作成され、18問のクイズへ
2. 結果画面の「リンクをコピーして友達を招待する」で招待リンクを共有
3. 友達はニックネームを登録してクイズに回答 → ホストとの相性が表示される
4. ホストの結果画面には、回答済みの友達の相性ランキングが表示される

部屋IDは推測されにくい英数字10文字のランダム文字列です（`utils/roomId.js`）。
「自分が誰か」は URL の `?p_id=` で引き継いでいます。

## セットアップ

### 1. 環境変数

`.env.local` に Supabase の接続情報を書きます。

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

### 2. Supabase のテーブル

| テーブル | カラム |
| --- | --- |
| `rooms` | `id` (text, 主キー, 英数字10文字) |
| `players` | `id`, `room_id` (text, `rooms.id` への外部キー), `name`, `answers` (json/配列), `pokemon_type` (text), `created_at` |

連番IDの `rooms` テーブルを使っていた場合は、`supabase/migrations/20261031000000_random_room_id.sql` を SQL Editor で実行してください（既存データは削除されます）。

### 3. 起動

```bash
npm install
npm run dev
```

http://localhost:3000 を開きます。
