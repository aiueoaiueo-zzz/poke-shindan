import { Avatar } from "../components/Avatar";
import { Hearts } from "../components/Hearts";
import { Button, PageTitle } from "../components/Layout";
import { MODE_LABEL } from "./Result";
import type { RankedHero } from "../../shared/logic";
import type { Hero, ResultText } from "../../shared/types";

export function Ranking({
  ranked,
  textFor,
  onSelect,
  onBack,
  onRestart,
}: {
  ranked: RankedHero[];
  textFor: (item: RankedHero) => ResultText;
  onSelect: (hero: Hero) => void;
  onBack: () => void;
  onRestart: () => void;
}) {
  const mode = ranked[0]?.mode;

  return (
    <div className="animate-fade-up space-y-5">
      <PageTitle title="相性ランキング" sub={mode && MODE_LABEL[mode]} onBack={onBack} />

      <ol className="space-y-2.5">
        {ranked.map((item, i) => {
          const isTop = i === 0;
          const isBottom = i === ranked.length - 1 && ranked.length > 1;
          const style = isTop
            ? "bg-gradient-to-r from-pink-main to-[#ff8fb1] text-white shadow-[0_4px_0_#d93d6b]"
            : isBottom
              ? "bg-white ring-2 ring-dashed ring-ink-soft/40 shadow-[0_4px_0_#e7dfe9]"
              : "bg-white shadow-[0_4px_0_#ffd1df]";
          return (
            <li key={item.hero.id}>
              <button
                type="button"
                onClick={() => onSelect(item.hero)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition active:translate-y-1 active:shadow-none ${style}`}
              >
                <span className="w-7 shrink-0 text-center text-lg font-extrabold">{isTop ? "👑" : i + 1}</span>
                <Avatar hero={item.hero} size={isTop ? 56 : 44} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.hero.name}</span>
                  <span className={`block text-xs ${isTop ? "text-white/90" : "text-ink-soft"}`}>
                    {isBottom ? "😵 " : ""}
                    {textFor(item).label}
                  </span>
                </span>
                <Hearts rank={item.rank} size="text-sm" onDark={isTop} />
              </button>
            </li>
          );
        })}
      </ol>

      <Button variant="ghost" onClick={onRestart}>
        最初からやり直す
      </Button>
    </div>
  );
}
