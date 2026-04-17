'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const VALID_LANGUAGES = ['ptbr', 'en'];

  useEffect(() => {
    if (!i18n.isInitialized) {
      const stored = localStorage.getItem('language');
      const language = stored && VALID_LANGUAGES.includes(stored) ? stored : 'ptbr';

      i18n.init({ lng: language });
      localStorage.setItem('language', language);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
