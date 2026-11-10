// Newsletter settings shared by the pages (built into the HTML) and the Worker API.
import type { Locale } from '../i18n';

/** The newsletter itself is written in Chinese, English and Japanese; the other locales receive the English edition
 *  (their confirmation and welcome emails stay in their own language). */
export type Edition = 'zh' | 'en' | 'ja';
export const EDITIONS: Edition[] = ['zh', 'en', 'ja'];
export const editionOf = (code: Locale): Edition => (code === 'zh-CN' ? 'zh' : code === 'ja' ? 'ja' : 'en');

/** Cloudflare Turnstile site key (public). Until the real widget exists this is Cloudflare's always-pass test key,
 *  which only works together with the matching test secret. */
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

/** The WeChat official account shown on the Chinese page; null hides the block. */
export const WECHAT: { name: string; qr: string } | null = null;

/** How long a confirmation link stays valid. */
export const CONFIRM_DAYS = 7;
