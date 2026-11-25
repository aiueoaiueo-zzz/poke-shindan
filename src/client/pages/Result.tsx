import { Avatar } from "../components/Avatar";
import { Hearts } from "../components/Hearts";
import { Button, Card } from "../components/Layout";
import { shareText, xShareUrl } from "../../shared/share";
import type { Hero, Mode, Rank, ResultText } from "../../shared/types";

export const MODE_LABEL: Record<Mode, string> = { love: "恋愛の相性", partner: "相棒の相性" };

/** 共有するサイトのURL。公開先が決まったら .env の VITE_SITE_URL で指定する */
function siteUrl(): string {
  return import.meta.env.VITE_SITE_URL || `${window.location.origin}/`;
}

export function Result({
  hero,
  rank,
  mode,
  text,
  onPickAnother,
  onRestart,
}: {
  hero: Hero;
  rank: Rank;
  mode: Mode;
  text: ResultText;
  onPickAnother: () => void;
  onRestart: () => void;
}) {
  const shareUrl = xShareUrl(shareText(hero.name, rank, text.label), siteUrl());

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

        {/* 場面画像：ハートの数（ランク）とモードごとに変わる */}
        <div className="mt-5 overflow-hidden rounded-2xl">
          {text.sceneImage ? (
            <img src={text.sceneImage} alt={`${text.label}の場面`} className="aspect-video w-full object-cover" />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-pink-soft to-sky-soft text-xs font-bold text-ink-soft">
              場面画像（準備中）
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3.5 text-base font-bold text-white shadow-[0_4px_0_#555] transition active:translate-y-1 active:shadow-none"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          結果をXでシェアする
        </a>
        <Button variant="secondary" onClick={onPickAnother}>
          ほかのヒーローとの相性を見る
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          最初からやり直す
        </Button>
      </div>
    </div>
  );
}
