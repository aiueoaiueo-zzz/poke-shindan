// データファイル（src/data/*.json）を型付きで読み込む。
// v1 はビルド時に取り込む。フェーズ2で D1 から読む形に置き換える。
import heroesJson from "../data/heroes.json";
import questionsJson from "../data/questions.json";
import compatibilityJson from "../data/compatibility.json";
import resultTextsJson from "../data/resultTexts.json";
import type { CompatibilityTable, Hero, Question, ResultText } from "./types";

export const heroes = heroesJson as Hero[];
export const questions = questionsJson as Question[];
export const compatibility = compatibilityJson as unknown as CompatibilityTable;
export const resultTexts = resultTextsJson as ResultText[];
