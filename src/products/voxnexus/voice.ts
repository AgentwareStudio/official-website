// The voices of the scenes: Japanese lines from the VoxNexus film (Gemini TTS, the same takes as the film; see
// launch/voxnexus/video/LICENSES.md). A line is found by the exact words on screen, so a voice only plays where the
// page shows what it says; other sentences and other languages keep the tones alone.
import ask from './voice/ask.m4a';
import cancel from './voice/cancel.m4a';
import deny from './voice/deny.m4a';
import make from './voice/make.m4a';
import stock from './voice/stock.m4a';
import why from './voice/why.m4a';

export interface Line { src: string; ms: number }

/** Spaces and the closing full stop do not count: 「A-1024 の納期は？」 is the take 「A-1024の納期は？」. */
const key = (text: string) => text.replace(/\s+/g, '').replace(/[。.]$/, '');

const LINES = new Map<string, Line>([
  ['A-1024 の納期は？', { src: ask, ms: 1920 }],
  ['A-1024 は、在庫が 120 個ございます。', { src: stock, ms: 3550 }],
  ['その注文、キャンセルして', { src: cancel, ms: 1480 }],
  ['申し訳ありません。この操作は許可されていません。担当者におつなぎします。', { src: deny, ms: 5370 }],
  ['夜間の修理受付担当を作って。キャンセルはできないようにして', { src: make, ms: 4650 }],
  ['昨夜の通話は、なぜ失敗した？', { src: why, ms: 2500 }],
].map(([text, line]) => [key(text as string), line as Line]));

export const voiceOf = (text: string): Line | undefined => LINES.get(key(text));
