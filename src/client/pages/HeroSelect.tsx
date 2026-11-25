import { Avatar } from "../components/Avatar";
import { PageTitle } from "../components/Layout";
import type { Hero } from "../../shared/types";

export function HeroSelect({ heroes, onSelect, onBack }: { heroes: Hero[]; onSelect: (hero: Hero) => void; onBack?: () => void }) {
  const sorted = [...heroes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="animate-fade-up space-y-5">
      <PageTitle title="気になるヒーローは？" sub="相性を見たいヒーローを1人選んでね" onBack={onBack} />

      <ul className="grid grid-cols-3 gap-3">
        {sorted.map((hero) => (
          <li key={hero.id}>
            <button
              type="button"
              onClick={() => onSelect(hero)}
              className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white px-1 pb-3 pt-4 shadow-[0_4px_0_#ffd1df] transition active:translate-y-1 active:shadow-none"
            >
              <Avatar hero={hero} size={64} />
              <span className="text-center text-xs font-bold leading-tight">{hero.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
