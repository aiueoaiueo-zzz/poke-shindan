import { describe, expect, it } from "vitest";
import { compatibility, heroes, questions, resultTexts } from "../src/shared/data";
import { decideMode, getRank, getResultText, judgeMbti, validateData } from "../src/shared/logic";
import { hearts, shareText, xShareUrl } from "../src/shared/share";
import type { Choice, Question } from "../src/shared/types";

/** 目標の4文字になるように回答を作る（各指標3問すべてその文字を選ぶ） */
function answersFor(target: string, qs: Question[]): Choice[] {
  return qs.map((q) => (target.includes(q.optionA.letter) ? "A" : "B"));
}

describe("データファイル", () => {
  it("仕様どおりの形になっている", () => {
    expect(validateData({ questions, heroes, table: compatibility, texts: resultTexts })).toEqual([]);
  });

  it("壊れた相性表を見つけられる", () => {
    const broken = structuredClone(compatibility);
    broken.ranks.INTJ.INTP = 5;
    const problems = validateData({ questions, heroes, table: broken, texts: resultTexts });
    expect(problems.some((p) => p.includes("対称"))).toBe(true);
    expect(problems.some((p) => p.includes("INTJ の「最高」"))).toBe(true);
  });
});

describe("judgeMbti", () => {
  it.each(compatibility.types)("%s になる回答で %s と判定する", (type) => {
    expect(judgeMbti(questions, answersFor(type, questions))).toBe(type);
  });

  it("指標ごとに多数決で決める（3問中2問なら採用）", () => {
    const answers = answersFor("ESTJ", questions);
    // EI の質問を1問だけ I に変えても E のまま
    const firstEI = questions.findIndex((q) => q.axis === "EI");
    answers[firstEI] = questions[firstEI].optionA.letter === "I" ? "A" : "B";
    expect(judgeMbti(questions, answers)).toBe("ESTJ");
  });

  it("回答の数が足りないとエラーにする", () => {
    expect(() => judgeMbti(questions, ["A"])).toThrow();
  });
});

describe("getRank", () => {
  it("相性表の値を返す", () => {
    expect(getRank(compatibility, "INTJ", "ESFJ")).toBe(5);
    expect(getRank(compatibility, "INTJ", "ESFP")).toBe(1);
    expect(getRank(compatibility, "ENFP", "ISTP")).toBe(5);
  });
});

describe("decideMode", () => {
  it("恋愛対象に女性が入るなら女性ヒーローは恋愛モード", () => {
    expect(decideMode(true, { gender: "female" })).toBe("love");
    expect(decideMode(false, { gender: "female" })).toBe("partner");
  });

  it("男性ヒーローは今のところ相棒モード", () => {
    expect(decideMode(true, { gender: "male" })).toBe("partner");
  });
});

describe("getResultText", () => {
  it("モードとランクに合う文言を返す", () => {
    expect(getResultText(resultTexts, "love", 5).label).toBe("運命の相手");
    expect(getResultText(resultTexts, "partner", 1).label).toBe("同じポータルを取り合う仲");
  });
});

describe("X への共有", () => {
  it("ハートの数だけ ♥ にする", () => {
    expect(hearts(3)).toBe("♥♥♥♡♡");
  });

  it("本文・URL・ハッシュタグを入れた投稿URLを作る", () => {
    const url = new URL(xShareUrl(shareText("サンプルヒーローC", 5, "運命の相手"), "https://example.com/"));
    expect(url.origin + url.pathname).toBe("https://x.com/intent/post");
    expect(url.searchParams.get("text")).toBe("サンプルヒーローCとの相性は…\n♥♥♥♥♥「運命の相手」でした！");
    expect(url.searchParams.get("url")).toBe("https://example.com/");
    expect(url.searchParams.get("hashtags")).toBe("コンパス,コンパス相性診断");
  });
});

describe("場面画像", () => {
  it("ハートの数ごとに違う画像になっている", () => {
    for (const mode of ["love", "partner"] as const) {
      const images = ([1, 2, 3, 4, 5] as const).map((r) => getResultText(resultTexts, mode, r).sceneImage);
      expect(new Set(images).size).toBe(5);
    }
  });
});
