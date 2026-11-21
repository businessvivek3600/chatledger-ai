'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'header' | 'sidebar' | 'compact' | 'minimal' | 'full';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'header',
  className = '',
}: LanguageSwitcherProps) {
  const { currentLanguage, languageObj, setLanguage, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E6EAF0] bg-white hover:bg-[#F2F4F7] text-[#202938] text-xs font-medium transition-colors shadow-xs"
          title={`Language: ${languageObj.nativeName}`}
        >
          <span className="text-sm">{languageObj.flag}</span>
          <span className="uppercase font-bold text-[11px] text-[#243B5A]">{languageObj.code}</span>
          <ChevronDown className="w-3 h-3 text-[#707B8B]" />
        </button>
      ) : variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-[#E6EAF0] bg-[#F7F8FA] hover:bg-[#F2F4F7] text-[#202938] text-xs font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#356AE6]" />
            <span className="truncate">{languageObj.nativeName}</span>
          </div>
          <span className="text-xs">{languageObj.flag}</span>
        </button>
      ) : variant === 'minimal' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7] transition-colors flex items-center gap-1"
          title={`Language: ${languageObj.nativeName}`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs uppercase font-semibold">{languageObj.code}</span>
        </button>
      ) : (
        /* Default Header Variant */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E6EAF0] bg-white hover:bg-[#F2F4F7] text-[#202938] text-xs font-medium transition-all shadow-xs"
        >
          <span className="text-sm">{languageObj.flag}</span>
          <span className="font-semibold text-xs text-[#202938] hidden sm:inline">
            {languageObj.nativeName}
          </span>
          <span className="font-semibold text-xs text-[#202938] sm:hidden uppercase">
            {languageObj.code}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#707B8B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white shadow-xl border border-[#E6EAF0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-[#E6EAF0]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707B8B]">
                {t('header.language', 'Select Language')}
              </span>
              <span className="text-[10px] text-[#356AE6] font-semibold">14 Languages</span>
            </div>
            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3 h-3 text-[#98A2B3] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search language..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg border border-[#E6EAF0] focus:outline-none focus:border-[#356AE6] bg-[#F7F8FA]"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredLanguages.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#707B8B] text-center">No languages match</div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                      setFilterQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-[#356AE6]/10 text-[#356AE6] font-bold'
                        : 'text-[#202938] hover:bg-[#F2F4F7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold leading-tight">{lang.nativeName}</span>
                        <span className="text-[10px] text-[#707B8B]">{lang.name}</span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#356AE6]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
