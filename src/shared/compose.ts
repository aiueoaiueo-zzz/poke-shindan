// 相性診断画像（場面テンプレートに顔をはめ込んだ1枚の画像）の組み立て方を決める。
// 実際に描くのは画面側（src/client/lib/compose.ts）。ここは計算だけなのでテストできる。
import type { FaceSlot, ResultText } from "./types";

/** 出来上がる画像の大きさ（X の投稿で見やすい 16:9） */
export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 675;

export interface ImageSize {
  width: number;
  height: number;
}

/** 顔画像のうち、円の中に使う正方形の範囲（真ん中を切り抜く） */
export function centerSquare(size: ImageSize): { sx: number; sy: number; side: number } {
  const side = Math.min(size.width, size.height);
  return { sx: (size.width - side) / 2, sy: (size.height - side) / 2, side };
}

/** 顔の位置に、だれのどの画像を入れるか */
export function faceSources(slots: FaceSlot[], heroFace: string, userFace: string): { slot: FaceSlot; src: string }[] {
  return slots.map((slot) => ({ slot, src: slot.who === "hero" ? heroFace : userFace }));
}

/** 場面テンプレートの設定におかしなところがないかを調べる（問題の一覧を返す） */
export function validateSlots(text: Pick<ResultText, "mode" | "rank" | "faceSlots">): string[] {
  const where = `結果（${text.mode}・ランク${text.rank}）`;
  const problems: string[] = [];
  if (!text.faceSlots.some((s) => s.who === "hero")) problems.push(`${where} にヒーローの顔の位置がありません`);
  for (const s of text.faceSlots) {
    if (s.r <= 0) problems.push(`${where} の顔の半径が 0 以下です`);
    if (s.x - s.r < 0 || s.x + s.r > IMAGE_WIDTH || s.y - s.r < 0 || s.y + s.r > IMAGE_HEIGHT) {
      problems.push(`${where} の顔の位置（${s.x}, ${s.y}）が画像からはみ出しています`);
    }
  }
  return problems;
}
