import { Suspense } from 'react';
import QuizClient from './QuizClient';

// 案内係（サーバー用）は、動く中身（QuizClient）をSuspenseで包んで呼び出すだけにします
export default function QuizPage() {
  return (
    <Suspense fallback={<main className="container"><article aria-busy="true">画面を準備中...</article></main>}>
      <QuizClient />
    </Suspense>
  );
}
