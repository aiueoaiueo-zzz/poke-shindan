# コンパス相性診断（仮）

「#コンパス」のオリジナル女の子ヒーローとの相性を診断する、ファンメイドの Web サイトです。
12問の質問に答えてヒーローを選ぶと、相性が5段階で表示されます。

- 仕様書：コンパス相性診断サイト 仕様書（v1）
- 今は **v1**（診断の流れと相性ロジック）。ヒーロー・質問・結果の文言はすべて仮のデータです。

## 画面の流れ

1. 最初の質問「恋愛対象に女性は入りますか？」 → はい＝恋愛の相性 ／ いいえ＝相棒の相性
2. 12問（2択）に答える → 裏で MBTI の4文字を判定（利用者には見せない）
3. ヒーローを選ぶ
4. 結果（ハート5段階・関係名・一言・場面画像）
5. ほかのヒーローを選ぶ ／ 相性ランキング ／ 最初から

回答と結果は保存しません（ページの中だけで完結）。

## 構成

| 役割 | 使っているもの |
|---|---|
| 画面 | React + Vite + TypeScript + Tailwind CSS |
| テスト | Vitest |
| 公開先 | Cloudflare Workers（静的アセット） |

```
src/
  data/       … 差し替え用のデータ（JSON）
    heroes.json        ヒーロー（id, name, gender, mbti, image, sortOrder）
    questions.json     質問（id, text, axis, optionA, optionB）
    compatibility.json 相性表（16×16、行＝利用者・列＝ヒーロー、1〜5）
    resultTexts.json   結果の文言（mode, rank, label, comment, sceneImage）
  shared/     … 画面と切り離した診断ロジック（logic.ts）と型（types.ts）
  client/     … 画面（React）
tests/        … ロジックとデータのテスト
```

## データの差し替え

`src/data/` の JSON を書き換えるだけで反映されます。書き換えたら `npm test` を実行してください。
次のようなミスがあるとテストが失敗して教えてくれます。

- 質問が指標（EI / SN / TF / JP）ごとに3問ずつになっていない、選択肢の文字が指標と合わない
- 相性表が対称でない、各タイプに「最高（5）」と「最悪（1）」がちょうど1つずつない
- ヒーローの MBTI が相性表にない、id が重複している
- 結果の文言が、モード（love / partner）× ランク（1〜5）で1件ずつそろっていない

画像は `public/` に置き、`image` や `sceneImage` に `/heroes/xxx.png` のようなパスを書きます。
画像がないヒーローは、名前の頭文字を丸の中に表示します。

## 開発

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # ロジックのテスト
npm run typecheck  # 型チェック
npm run build      # dist/ に書き出し
```

## 公開（Cloudflare Workers）

`master` ブランチに変更が入ると、GitHub Actions（`.github/workflows/deploy.yml`）がテストしてからデプロイします。
初回だけ、GitHub の「Settings」→「Secrets and variables」→「Actions」→「Secrets」に次の2つを登録してください（HS合わせアプリと同じ値で使えます）。

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

公開URLは `https://compass-shindan.<アカウントのサブドメイン>.workers.dev/` になります。

## 公開前に確認すること

- 相性表の値は参考サイトから取った仮データ。自分で調整するか、利用規約を確認する
- ヒーロー画像を使う前に、#コンパスの二次創作ガイドラインを確認する
- トモコレは仕組みと雰囲気だけ参考にし、タイプ名・画面・ロゴなどは使わない
