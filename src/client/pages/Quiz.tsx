import { Card } from "../components/Layout";
import type { Choice, Question } from "../../shared/types";

export function Quiz({
  questions,
  answers,
  onAnswer,
  onBack,
}: {
  questions: Question[];
  answers: Choice[];
  onAnswer: (choice: Choice) => void;
  onBack: () => void;
}) {
  const index = answers.length;
  const question = questions[index];
  if (!question) return null;
  const progress = (index / questions.length) * 100;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between text-sm font-bold">
          <button type="button" onClick={onBack} className="text-ink-soft">
            ‹ もどる
          </button>
          <span className="text-pink-main">
            Q{index + 1} <span className="text-ink-soft">/ {questions.length}</span>
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-pink-soft">
          <div className="h-full rounded-full bg-pink-main transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* key で質問が変わるたびにアニメーションし直す */}
      <Card key={question.id} className="animate-fade-up">
        <h2 className="text-center text-lg font-bold leading-relaxed">{question.text}</h2>
        <div className="mt-5 space-y-3">
          {(["A", "B"] as Choice[]).map((choice) => {
            const option = choice === "A" ? question.optionA : question.optionB;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => onAnswer(choice)}
                className="flex w-full items-center gap-3 rounded-2xl bg-cream px-4 py-4 text-left text-[15px] font-medium leading-snug ring-2 ring-pink-soft transition active:scale-[0.98] active:bg-pink-soft"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-main text-sm font-extrabold text-white">
                  {choice}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
