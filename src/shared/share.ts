// X（旧Twitter）に共有する文章とURLを作る。画面と切り離してテストできるようにしている
import type { Rank } from "./types";

export const SHARE_HASHTAGS = ["コンパス", "コンパス相性診断"];

export function hearts(rank: Rank): string {
  return "♥".repeat(rank) + "♡".repeat(5 - rank);
}

export function shareText(heroName: string, rank: Rank, label: string): string {
  return `${heroName}との相性は…\n${hearts(rank)}「${label}」でした！`;
}

/** X の投稿画面を開くURL。本文・サイトのURL・ハッシュタグを入れておく */
export function xShareUrl(text: string, siteUrl: string, hashtags: string[] = SHARE_HASHTAGS): string {
  const params = new URLSearchParams({ text, url: siteUrl, hashtags: hashtags.join(",") });
  return `https://x.com/intent/post?${params.toString()}`;
}
