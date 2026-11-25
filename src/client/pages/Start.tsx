import { Button, Card } from "../components/Layout";

export function Start({ onAnswer }: { onAnswer: (likesWomen: boolean) => void }) {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="pt-4 text-center">
        <p className="text-5xl">💘</p>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug">
          あの子との相性、
          <br />
          診断してみない？
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          12個の質問に答えて、好きな女の子ヒーローを選ぶと、
          <br />
          ふたりの相性がわかります。
        </p>
      </div>

      <Card>
        <p className="text-center text-xs font-bold text-pink-main">はじめに</p>
        <h2 className="mt-2 text-center text-lg font-bold">恋愛対象に女性は入りますか？</h2>
        <p className="mt-2 text-center text-xs text-ink-soft">答えによって、恋愛の相性か相棒としての相性かが変わります</p>
        <div className="mt-5 space-y-3">
          <Button onClick={() => onAnswer(true)}>はい</Button>
          <Button variant="secondary" onClick={() => onAnswer(false)}>
            いいえ
          </Button>
        </div>
      </Card>
    </div>
  );
}
