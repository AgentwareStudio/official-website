// Newsletter copy: the /start pages, the confirmation page and the emails, in all eight locales. JSON (not the site's
// i18n pipeline) so the font subsetting (tools/fonts.py) can read the Japanese and Korean characters directly.
import type { Locale } from '../i18n';
import de from './strings/de.json';
import en from './strings/en.json';
import es from './strings/es.json';
import fr from './strings/fr.json';
import ja from './strings/ja.json';
import ko from './strings/ko.json';
import ptBR from './strings/pt-BR.json';
import zhCN from './strings/zh-CN.json';

export type NewsletterStrings = typeof en;
export const NEWSLETTER: Record<Locale, NewsletterStrings> = { 'zh-CN': zhCN, en, ja, ko, es, fr, de, 'pt-BR': ptBR };
