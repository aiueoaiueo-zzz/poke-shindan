// データの型。フェーズ2で D1 のテーブルにそのまま移せる形にしている（仕様書「データ設計」）

export type Axis = "EI" | "SN" | "TF" | "JP";
export type Letter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type Gender = "female" | "male";
export type Mode = "love" | "partner";
export type Rank = 1 | 2 | 3 | 4 | 5;

export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface Hero {
  id: string;
  name: string;
  gender: Gender;
  mbti: MbtiType;
  /** 画像のパス。ないときは null（画面では名前の頭文字を丸の中に出す） */
  image: string | null;
  sortOrder: number;
}

export interface QuestionOption {
  text: string;
  letter: Letter;
}

export interface Question {
  id: number;
  text: string;
  axis: Axis;
  optionA: QuestionOption;
  optionB: QuestionOption;
}

/** 選んだ選択肢。"A" か "B" */
export type Choice = "A" | "B";

export interface CompatibilityTable {
  types: MbtiType[];
  /** ranks[利用者][ヒーロー] = 1〜5 */
  ranks: Record<MbtiType, Record<MbtiType, Rank>>;
}

export interface ResultText {
  mode: Mode;
  rank: Rank;
  label: string;
  comment: string;
  sceneImage: string | null;
}
