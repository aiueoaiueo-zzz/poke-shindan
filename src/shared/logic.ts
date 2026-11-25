// 診断ロジック。画面（React）とは切り離して、テストできるようにしている
import type {
  Axis,
  Choice,
  CompatibilityTable,
  Gender,
  Hero,
  Letter,
  MbtiType,
  Mode,
  Question,
  Rank,
  ResultText,
} from "./types";

export const AXES: Axis[] = ["EI", "SN", "TF", "JP"];
export const QUESTIONS_PER_AXIS = 3;

/**
 * 最初の質問の答え（恋愛対象に女性は入るか）とヒーローの性別から、モードを決める。
 * 今は全員女性なので全ヒーロー共通になるが、将来男性ヒーローを足したときに
 * ヒーローごとに判定できるよう、ヒーローを受け取る形にしている。
 */
export function decideMode(likesWomen: boolean, hero: Pick<Hero, "gender">): Mode {
  const loveTargets: Gender[] = likesWomen ? ["female"] : [];
  return loveTargets.includes(hero.gender) ? "love" : "partner";
}

/**
 * 回答（"A"/"B" の並び）から MBTI の4文字を判定する。
 * 指標ごとに多かった方の文字を採用する。各指標3問なので同数にはならない。
 */
export function judgeMbti(questions: Question[], answers: Choice[]): MbtiType {
  if (answers.length !== questions.length) {
    throw new Error(`回答の数（${answers.length}）が質問の数（${questions.length}）と合いません`);
  }

  const counts = new Map<Letter, number>();
  questions.forEach((q, i) => {
    const option = answers[i] === "A" ? q.optionA : q.optionB;
    counts.set(option.letter, (counts.get(option.letter) ?? 0) + 1);
  });

  const pick = (axis: Axis): Letter => {
    const [first, second] = axis.split("") as [Letter, Letter];
    return (counts.get(first) ?? 0) >= (counts.get(second) ?? 0) ? first : second;
  };

  return AXES.map(pick).join("") as MbtiType;
}

/** 利用者とヒーローの MBTI から相性ランク（1〜5）を引く */
export function getRank(table: CompatibilityTable, user: MbtiType, hero: MbtiType): Rank {
  const rank = table.ranks[user]?.[hero];
  if (rank === undefined) throw new Error(`相性表に ${user} × ${hero} がありません`);
  return rank;
}

/** モードとランクに合う結果の文言を探す */
export function getResultText(texts: ResultText[], mode: Mode, rank: Rank): ResultText {
  const text = texts.find((t) => t.mode === mode && t.rank === rank);
  if (!text) throw new Error(`結果の文言がありません（mode=${mode}, rank=${rank}）`);
  return text;
}

/**
 * データファイルの中身が仕様どおりかを確かめる。問題があればその内容を返す（なければ空配列）。
 * データを差し替えたときに、テストで壊れていないかを確認するために使う。
 */
export function validateData(data: {
  questions: Question[];
  heroes: Hero[];
  table: CompatibilityTable;
  texts: ResultText[];
}): string[] {
  const problems: string[] = [];
  const { questions, heroes, table, texts } = data;

  // 質問：各指標3問、選択肢の文字がその指標の2文字に1つずつ
  for (const axis of AXES) {
    const qs = questions.filter((q) => q.axis === axis);
    if (qs.length !== QUESTIONS_PER_AXIS) {
      problems.push(`指標 ${axis} の質問が ${qs.length} 問です（${QUESTIONS_PER_AXIS} 問必要）`);
    }
    for (const q of qs) {
      const letters = [q.optionA.letter, q.optionB.letter].sort().join("");
      if (letters !== axis.split("").sort().join("")) {
        problems.push(`質問 ${q.id} の選択肢の文字（${q.optionA.letter}/${q.optionB.letter}）が指標 ${axis} と合いません`);
      }
    }
  }
  const qIds = new Set(questions.map((q) => q.id));
  if (qIds.size !== questions.length) problems.push("質問の id が重複しています");

  // 相性表：16タイプ、対称、各タイプに最高(5)と最悪(1)がちょうど1つずつ
  if (table.types.length !== 16) problems.push(`相性表のタイプが ${table.types.length} 個です（16 個必要）`);
  for (const a of table.types) {
    const row = table.types.map((b) => table.ranks[a]?.[b]);
    if (row.some((r) => r === undefined || r < 1 || r > 5 || !Number.isInteger(r))) {
      problems.push(`相性表の ${a} の行に 1〜5 以外の値があります`);
      continue;
    }
    for (const b of table.types) {
      if (table.ranks[a][b] !== table.ranks[b]?.[a]) {
        problems.push(`相性表が対称ではありません（${a}×${b} と ${b}×${a}）`);
      }
    }
    if (row.filter((r) => r === 5).length !== 1) problems.push(`${a} の「最高」の相手が1タイプではありません`);
    if (row.filter((r) => r === 1).length !== 1) problems.push(`${a} の「最悪」の相手が1タイプではありません`);
  }

  // ヒーロー：id の重複なし、MBTI が相性表にある
  const heroIds = new Set(heroes.map((h) => h.id));
  if (heroIds.size !== heroes.length) problems.push("ヒーローの id が重複しています");
  for (const h of heroes) {
    if (!table.types.includes(h.mbti)) problems.push(`ヒーロー ${h.name} の MBTI（${h.mbti}）が相性表にありません`);
  }

  // 結果の文言：各モードにランク1〜5が1件ずつ
  for (const mode of ["love", "partner"] as Mode[]) {
    for (const rank of [1, 2, 3, 4, 5] as Rank[]) {
      const n = texts.filter((t) => t.mode === mode && t.rank === rank).length;
      if (n !== 1) problems.push(`結果の文言（${mode}・ランク${rank}）が ${n} 件あります（1 件必要）`);
    }
  }

  return problems;
}
