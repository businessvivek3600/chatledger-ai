import { en, TranslationType } from './en';
import { hi } from './hi';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ar } from './ar';
import { pt } from './pt';
import { ru } from './ru';
import { zh } from './zh';
import { ja } from './ja';
import { it } from './it';
import { id } from './id';
import { tr } from './tr';
import { bn } from './bn';

export const translations: Record<string, TranslationType> = {
  en,
  hi,
  es,
  fr,
  de,
  ar,
  pt,
  ru,
  zh,
  ja,
  it,
  id,
  tr,
  bn,
};

export type { TranslationType };
