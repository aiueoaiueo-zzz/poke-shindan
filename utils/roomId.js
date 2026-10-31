// 🔐 部屋IDを推測されにくいランダム文字列で作るためのユーティリティ
// 連番IDだと「/room/1」「/room/2」…と順番に他人の部屋を覗けてしまうため、
// 英大文字・英小文字・数字（62種類）からなる10文字のIDを暗号学的乱数で生成します。
// 62^10 ≒ 8.4×10^17 通りあるので、総当たりで見つけるのは現実的ではありません。

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const ROOM_ID_LENGTH = 10;

// 248 = 62 × 4。これ以上の値を捨てることで、文字の出現確率の偏り（モジュロバイアス）をなくす
const MAX_UNBIASED_BYTE = 248;

export function generateRoomId(length = ROOM_ID_LENGTH) {
  let id = '';
  while (id.length < length) {
    const bytes = crypto.getRandomValues(new Uint8Array(length * 2));
    for (const byte of bytes) {
      if (byte < MAX_UNBIASED_BYTE) {
        id += ALPHABET[byte % ALPHABET.length];
        if (id.length === length) break;
      }
    }
  }
  return id;
}

// URLから来た部屋IDが正しい形式かをチェック（変な値でDBを叩かないため）
export function isValidRoomId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9]{10}$/.test(value);
}
