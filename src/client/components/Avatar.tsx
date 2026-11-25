import { useState } from "react";
import type { Hero } from "../../shared/types";

// 画像がないヒーローは、名前の頭文字を丸の中に出す（仕様書「データ設計」）
const COLORS = ["#ff8fb1", "#8cc8ff", "#ffc56b", "#9be0b5", "#c6a6ff", "#ff9f80"];

function colorFor(id: string): string {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return COLORS[sum % COLORS.length];
}

/** 名前から頭文字を取る。「サンプルヒーローA」のように末尾が英字なら、それを使う */
function initialOf(name: string): string {
  const tail = name.match(/[A-Za-z0-9]$/);
  return tail ? tail[0] : [...name][0] ?? "?";
}

export function Avatar({ hero, size = 64 }: { hero: Hero; size?: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };

  if (hero.image && !broken) {
    return (
      <img
        src={hero.image}
        alt={hero.name}
        style={style}
        className="shrink-0 rounded-full bg-white object-cover ring-4 ring-white"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ ...style, background: colorFor(hero.id), fontSize: size * 0.42 }}
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ring-4 ring-white"
    >
      {initialOf(hero.name)}
    </div>
  );
}
