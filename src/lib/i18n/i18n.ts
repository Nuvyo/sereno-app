import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { PTBR_TRANLATIONS } from './translations/ptbr';
import { EN_TRANSLATIONS } from './translations/en';

i18n.use(initReactI18next).init({
  resources: {
    ptbr: { translation: PTBR_TRANLATIONS },
    en: { translation: EN_TRANSLATIONS },
  },
  lng: 'ptbr',
  fallbackLng: 'ptbr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
