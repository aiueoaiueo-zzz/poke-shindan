import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/Layout";
import { HeroSelect } from "./pages/HeroSelect";
import { Quiz } from "./pages/Quiz";
import { Ranking } from "./pages/Ranking";
import { Result } from "./pages/Result";
import { Start } from "./pages/Start";
import { compatibility, heroes, questions, resultTexts } from "../shared/data";
import { decideMode, getRank, getResultText, judgeMbti, rankHeroes } from "../shared/logic";
import type { Choice, MbtiType } from "../shared/types";

// 画面の流れ（仕様書「画面の流れ」）：最初の質問 → 12問 → ヒーロー選択 → 結果 → ほかのヒーロー／ランキング／最初から
type Step = "start" | "quiz" | "heroes" | "result" | "ranking";

// 回答と結果は保存しない（ページ内で完結）。ブラウザの「戻る」で画面を戻れるように、画面名だけ履歴に積む
export default function App() {
  const [step, setStep] = useState<Step>("start");
  const [likesWomen, setLikesWomen] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<Choice[]>([]);
  const [heroId, setHeroId] = useState<string | null>(null);

  const mbti: MbtiType | null = useMemo(
    () => (answers.length === questions.length ? judgeMbti(questions, answers) : null),
    [answers],
  );
  const hero = heroes.find((h) => h.id === heroId) ?? null;

  // 画面を進める（ブラウザの履歴にも積む）
  const go = (next: Step) => {
    setStep(next);
    window.history.pushState({ step: next }, "");
    window.scrollTo(0, 0);
  };

  // ブラウザの「戻る」「進む」
  useEffect(() => {
    window.history.replaceState({ step: "start" }, "");
    const onPop = (e: PopStateEvent) => {
      const s = (e.state?.step as Step | undefined) ?? "start";
      setStep(s);
      if (s === "start") setAnswers([]);
      // ヒーロー選択から戻ったときは、最後の質問に答える前の状態にする
      if (s === "quiz") setAnswers((a) => (a.length === questions.length ? a.slice(0, -1) : a));
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const restart = () => {
    setLikesWomen(null);
    setAnswers([]);
    setHeroId(null);
    go("start");
  };

  // 必要な情報がそろっていない画面に来たとき（履歴で進んだときなど）は最初に戻す
  const ready =
    step === "start" ||
    (step === "quiz" && likesWomen !== null && !mbti) ||
    (step === "heroes" && likesWomen !== null && mbti) ||
    (step === "result" && likesWomen !== null && mbti && hero) ||
    (step === "ranking" && likesWomen !== null && mbti);

  let content;
  if (!ready || step === "start") {
    content = (
      <Start
        onAnswer={(answer) => {
          setLikesWomen(answer);
          setAnswers([]);
          setHeroId(null);
          go("quiz");
        }}
      />
    );
  } else if (step === "quiz") {
    content = (
      <Quiz
        questions={questions}
        answers={answers}
        onAnswer={(choice) => {
          const next = [...answers, choice];
          setAnswers(next);
          if (next.length === questions.length) go("heroes");
          else window.scrollTo(0, 0);
        }}
        onBack={() => (answers.length === 0 ? restart() : setAnswers(answers.slice(0, -1)))}
      />
    );
  } else if (step === "heroes") {
    content = (
      <HeroSelect
        heroes={heroes}
        onSelect={(h) => {
          setHeroId(h.id);
          go("result");
        }}
        onBack={() => window.history.back()}
      />
    );
  } else if (step === "result" && hero && mbti && likesWomen !== null) {
    const rank = getRank(compatibility, mbti, hero.mbti);
    const mode = decideMode(likesWomen, hero);
    content = (
      <Result
        hero={hero}
        rank={rank}
        mode={mode}
        text={getResultText(resultTexts, mode, rank)}
        onPickAnother={() => go("heroes")}
        onRanking={() => go("ranking")}
        onRestart={restart}
      />
    );
  } else if (step === "ranking" && mbti && likesWomen !== null) {
    content = (
      <Ranking
        ranked={rankHeroes(compatibility, heroes, mbti, likesWomen)}
        textFor={(item) => getResultText(resultTexts, item.mode, item.rank)}
        onSelect={(h) => {
          setHeroId(h.id);
          go("result");
        }}
        onBack={() => window.history.back()}
        onRestart={restart}
      />
    );
  }

  return <Layout onHome={step === "start" ? undefined : restart}>{content}</Layout>;
}
