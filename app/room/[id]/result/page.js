import { Suspense } from 'react';
import ResultClient from './ResultClient';

// 案内係（サーバー用）は、動く中身（ResultClient）をSuspenseで包んで呼び出すだけにします
export default function ResultPage() {
  return (
    <Suspense fallback={<main className="container"><article aria-busy="true">ポケモンの世界からデータをひっぱってきているよ...</article></main>}>
      <ResultClient />
    </Suspense>
  );
}
