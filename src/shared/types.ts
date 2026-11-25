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
  /** 一覧で使う画像のパス。ないときは null（画面では名前の頭文字を丸の中に出す） */
  image: string | null;
  /** 相性診断画像で場面にはめ込む顔の画像（正方形）。ないときは image を使う */
  faceImage: string | null;
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

/** 場面テンプレートの中で顔をはめ込む位置（テンプレート画像のピクセル座標） */
export interface FaceSlot {
  /** だれの顔を入れるか */
  who: "hero" | "user";
  /** 顔の中心 */
  x: number;
  y: number;
  /** 顔の半径 */
  r: number;
  /** 傾き（度）。省略時 0 */
  rotate?: number;
}

export interface ResultText {
  mode: Mode;
  rank: Rank;
  label: string;
  comment: string;
  /** 場面テンプレートの画像。顔の部分を空けておく */
  sceneImage: string | null;
  /** sceneImage の中で顔を入れる位置 */
  faceSlots: FaceSlot[];
}
