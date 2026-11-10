// Newsletter settings shared by the pages (built into the HTML) and the Worker API.
import type { Locale } from '../i18n';
import wechatQr from '../assets/newsletter/wechat_aikit_qr.webp?url';

/** The newsletter itself is written in Chinese, English and Japanese; the other locales receive the English edition
 *  (their confirmation and welcome emails stay in their own language). */
export type Edition = 'zh' | 'en' | 'ja';
export const EDITIONS: Edition[] = ['zh', 'en', 'ja'];
export const editionOf = (code: Locale): Edition => (code === 'zh-CN' ? 'zh' : code === 'ja' ? 'ja' : 'en');

/** Cloudflare Turnstile site key (public; the widget allows agentware.studio and the workers.dev previews). Local
 *  testing uses Cloudflare's always-pass test keys instead (README "Newsletter"). */
export const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAF7dF6DrOvvVMqZN';

/** The WeChat official account shown on the Chinese page; null hides the block. */
export const WECHAT: { name: string; qr: string } | null = { name: 'AIKit您的人工智能工具箱', qr: wechatQr };

/** How long a confirmation link stays valid. */
export const CONFIRM_DAYS = 7;
