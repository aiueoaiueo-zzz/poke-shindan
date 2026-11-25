import { Avatar } from "../components/Avatar";
import { Hearts } from "../components/Hearts";
import { Button, Card } from "../components/Layout";
import type { Hero, Mode, Rank, ResultText } from "../../shared/types";

export const MODE_LABEL: Record<Mode, string> = { love: "恋愛の相性", partner: "相棒の相性" };

export function Result({
  hero,
  rank,
  mode,
  text,
  onPickAnother,
  onRanking,
  onRestart,
}: {
  hero: Hero;
  rank: Rank;
  mode: Mode;
  text: ResultText;
  onPickAnother: () => void;
  onRanking: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card key={hero.id} className="animate-fade-up text-center">
        <p className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${mode === "love" ? "bg-pink-soft text-pink-main" : "bg-sky-soft text-sky-main"}`}>
          {MODE_LABEL[mode]}
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-soft text-sm font-extrabold text-pink-main ring-4 ring-white">
            あなた
          </div>
          <span className="text-2xl text-pink-main">♥</span>
          <Avatar hero={hero} size={64} />
        </div>
        <p className="mt-2 text-sm font-bold">あなた と {hero.name}</p>

        <div className="mt-5">
          <Hearts rank={rank} size="text-4xl" animate />
        </div>
        <h1 className="mt-3 animate-pop-in text-3xl font-extrabold text-pink-main" style={{ animationDelay: "0.75s" }}>
          {text.label}
        </h1>
        <p className="mt-3 text-sm leading-relaxed">{text.comment}</p>

        {/* 場面画像。素材がないあいだは枠だけ出す */}
        <div className="mt-5 overflow-hidden rounded-2xl">
          {text.sceneImage ? (
            <img src={text.sceneImage} alt={`${text.label}の場面`} className="w-full" />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-pink-soft to-sky-soft text-xs font-bold text-ink-soft">
              場面画像（準備中）
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <Button onClick={onPickAnother}>ほかのヒーローとの相性を見る</Button>
        <Button variant="secondary" onClick={onRanking}>
          相性ランキングを見る
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          最初からやり直す
        </Button>
      </div>
    </div>
  );
}
