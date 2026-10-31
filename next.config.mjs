// GitHub Pages は静的ファイルしか置けないため、`next build` で out/ に HTML を書き出す（static export）
// プロジェクトページは https://<ユーザー名>.github.io/poke-shindan/ のようにサブパスで公開されるので、
// GitHub Actions から渡される PAGES_BASE_PATH（例: /poke-shindan）を basePath に設定する。
// ローカル開発（npm run dev）では空文字になり、http://localhost:3000/ で動く。
const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  // /quiz → /quiz/index.html として書き出し、GitHub Pages でそのまま開けるようにする
  trailingSlash: true,
  // 招待リンクを組み立てるときに basePath が必要なので、クライアント側にも渡す
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
