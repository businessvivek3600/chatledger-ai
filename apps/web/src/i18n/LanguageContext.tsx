'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languages';
import { translations, TranslationType } from './translations';

interface LanguageContextType {
  currentLanguage: string;
  languageObj: Language;
  setLanguage: (lang: string) => void;
  t: (path: string, paramsOrFallback?: Record<string, any> | string, fallback?: string) => string;
  isRTL: boolean;
  supportedLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: DEFAULT_LANGUAGE,
  languageObj: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  t: (path: string) => path,
  isRTL: false,
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLangState] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chatledger_locale');
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setCurrentLangState(stored);
        applyDocumentAttributes(stored);
        return;
      }

      // Detect browser language
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserCode = navigator.language.split('-')[0].toLowerCase();
        const matched = SUPPORTED_LANGUAGES.find((l) => l.code === browserCode);
        if (matched) {
          setCurrentLangState(matched.code);
          applyDocumentAttributes(matched.code);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    applyDocumentAttributes(DEFAULT_LANGUAGE);
  }, []);

  const applyDocumentAttributes = (code: string) => {
    if (typeof document === 'undefined') return;
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = code;
    document.documentElement.dir = langObj.direction;
    if (langObj.direction === 'rtl') {
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.documentElement.classList.remove('rtl-layout');
    }
  };

  const setLanguage = (code: string) => {
    const valid = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!valid) return;

    setCurrentLangState(code);
    try {
      localStorage.setItem('chatledger_locale', code);
    } catch (e) {
      // ignore
    }
    applyDocumentAttributes(code);
  };

  const languageObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRTL = languageObj.direction === 'rtl';

  const t = (
    path: string,
    paramsOrFallback?: Record<string, any> | string,
    fallback?: string,
  ): string => {
    let params: Record<string, any> = {};
    let customFallback: string | undefined = fallback;

    if (typeof paramsOrFallback === 'string') {
      customFallback = paramsOrFallback;
    } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
      params = paramsOrFallback;
    }

    const keys = path.split('.');
    const activeDict = translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
    const defaultDict = translations[DEFAULT_LANGUAGE];

    // Helper to traverse object
    const resolve = (dict: any): any => {
      let cur = dict;
      for (const k of keys) {
        if (!cur || typeof cur !== 'object' || !(k in cur)) {
          return undefined;
        }
        cur = cur[k];
      }
      return cur;
    };

    let result = resolve(activeDict);
    if (result === undefined || typeof result !== 'string') {
      result = resolve(defaultDict);
    }

    if (result === undefined || typeof result !== 'string') {
      result = customFallback || path;
    }

    // Interpolate {key} with params
    if (params && typeof result === 'string') {
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageObj,
        setLanguage,
        t,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
