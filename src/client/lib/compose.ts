// 場面テンプレートに顔をはめ込んで、相性診断画像（PNG）を作る
import { IMAGE_HEIGHT, IMAGE_WIDTH, centerSquare, faceSources } from "../../shared/compose";
import { hearts } from "../../shared/share";
import type { Hero, Rank, ResultText } from "../../shared/types";

export const USER_FACE = "faces/you.svg";
const FONT = '"M PLUS Rounded 1c", sans-serif';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`画像を読み込めませんでした: ${src}`));
    img.src = src;
  });
}

/** 角丸の四角 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export async function composeResultImage(opts: {
  hero: Hero;
  rank: Rank;
  text: ResultText;
  siteName: string;
}): Promise<Blob> {
  const { hero, rank, text, siteName } = opts;
  if (!text.sceneImage) throw new Error("場面テンプレートがありません");

  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_WIDTH;
  canvas.height = IMAGE_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  // 文字を描く前にフォントを読み込んでおく
  await document.fonts?.load(`800 48px ${FONT}`).catch(() => undefined);

  const heroFace = hero.faceImage ?? hero.image;
  const [scene, ...faces] = await Promise.all([
    loadImage(text.sceneImage),
    ...faceSources(text.faceSlots, heroFace ?? USER_FACE, USER_FACE).map(({ src }) => loadImage(src)),
  ]);

  // 1. 場面テンプレート
  ctx.drawImage(scene, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  // 2. 顔を丸く切り抜いて、決まった位置にはめ込む
  text.faceSlots.forEach((slot, i) => {
    const face = faces[i];
    const { sx, sy, side } = centerSquare({ width: face.naturalWidth || 400, height: face.naturalHeight || 400 });
    ctx.save();
    ctx.translate(slot.x, slot.y);
    ctx.rotate(((slot.rotate ?? 0) * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, slot.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.clip();
    ctx.drawImage(face, sx, sy, side, side, -slot.r, -slot.r, slot.r * 2, slot.r * 2);
    ctx.restore();
    // 白いふち
    ctx.save();
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, slot.r, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.restore();
  });

  // 3. 下の帯：ヒーロー名・ハート・関係名
  const bandH = 120;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(ctx, 40, IMAGE_HEIGHT - bandH - 30, IMAGE_WIDTH - 80, bandH, 36);
  ctx.fill();
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#3a2e3f";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText(`あなた と ${hero.name}`, 80, IMAGE_HEIGHT - 30 - bandH + 38);
  ctx.fillStyle = "#ff5c8a";
  ctx.font = `800 50px ${FONT}`;
  ctx.fillText(text.label, 80, IMAGE_HEIGHT - 30 - 38);
  ctx.textAlign = "right";
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText(hearts(rank), IMAGE_WIDTH - 80, IMAGE_HEIGHT - 30 - bandH / 2);

  // 4. 右上にサイト名
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.font = `700 26px ${FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(`♡ ${siteName}`, IMAGE_WIDTH - 40, 30);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("画像を作れませんでした"))), "image/png"),
  );
}

/**
 * 画像を保存・共有する。スマホでは共有シート（「画像を保存」や X などを選べる）を開き、
 * 使えないブラウザではダウンロードする。
 */
export async function saveOrShareImage(blob: Blob, fileName: string, text: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}
