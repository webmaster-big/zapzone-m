import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from './en.json';
import { PREF_KEYS, prefs } from '@/lib/storage/mmkv';

const resources = {
  en: { translation: en },
} as const;

const savedLanguage = prefs.getString(PREF_KEYS.language);
const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

/** Initializes i18next once. Currently ships English; structured so additional
 * locales can be added under `resources` without touching feature code. */
export function initI18n(): void {
  if (i18n.isInitialized) return;
  void i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage ?? (deviceLanguage in resources ? deviceLanguage : 'en'),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function setLanguage(language: string): void {
  prefs.setString(PREF_KEYS.language, language);
  void i18n.changeLanguage(language);
}

export default i18n;
