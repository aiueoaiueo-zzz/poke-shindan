import type { ReactNode } from "react";

export const SITE_NAME = "コンパス相性診断（仮）";

export function Layout({ children, onHome }: { children: ReactNode; onHome?: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-6">
      <header className="flex items-center justify-center py-4">
        <button type="button" onClick={onHome} className="text-base font-extrabold tracking-wide text-pink-main" disabled={!onHome}>
          ♡ {SITE_NAME}
        </button>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-10 space-y-1 text-center text-[11px] leading-relaxed text-ink-soft">
        <p>この診断は娯楽目的です。結果はお楽しみとしてご覧ください。</p>
        <p>ファンが作った非公式のサイトです。公式とは関係ありません。</p>
      </footer>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-[0_6px_0_#ffd1df] ${className}`}>{children}</div>;
}

/** 画面のタイトル。左に「もどる」を置いても、タイトルは真ん中にそろえる */
export function PageTitle({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <div>
      <div className="grid grid-cols-[4rem_1fr_4rem] items-center">
        <div>
          {onBack && (
            <button type="button" onClick={onBack} className="text-sm font-bold text-ink-soft">
              ‹ もどる
            </button>
          )}
        </div>
        <h1 className="text-center text-xl font-extrabold">{title}</h1>
      </div>
      {sub && <p className="mt-1 text-center text-sm text-ink-soft">{sub}</p>}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-pink-main text-white shadow-[0_4px_0_#d93d6b] active:translate-y-1 active:shadow-none",
  secondary: "bg-white text-pink-main ring-2 ring-pink-main shadow-[0_4px_0_#ffd1df] active:translate-y-1 active:shadow-none",
  ghost: "text-ink-soft underline underline-offset-4",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full px-5 py-3.5 text-base font-bold transition ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
