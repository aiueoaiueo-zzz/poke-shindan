import type { Rank } from "../../shared/types";

/** ハート5個のうち、ランクの数だけ点灯させる */
export function Hearts({
  rank,
  size = "text-3xl",
  animate = false,
  onDark = false,
}: {
  rank: Rank;
  size?: string;
  animate?: boolean;
  /** 色付きの背景の上に置くとき true（白いハートにする） */
  onDark?: boolean;
}) {
  const lit = onDark ? "text-white" : "text-pink-main";
  const unlit = onDark ? "text-white/35" : "text-pink-soft";
  return (
    <span className={`flex justify-center gap-1 ${size}`} role="img" aria-label={`相性 5段階中 ${rank}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${n <= rank ? lit : unlit} ${animate ? "animate-pop-in" : ""}`}
          style={animate ? { animationDelay: `${n * 0.12}s` } : undefined}
        >
          ♥
        </span>
      ))}
    </span>
  );
}
