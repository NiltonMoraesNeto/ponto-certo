import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEn from './../locales/en/translation.json'
import translationBr from './../locales/br/translation.json'
import translationEs from './../locales/es/translation.json'

const resources: Resource = {
  en: { translation: translationEn },
  br: { translation: translationBr },
  es: { translation: translationEs },
}

const supportedLanguages = ['br', 'en', 'es'] as const
const fallbackLanguage = 'br'

const detectedLanguage = (): string => {
  const languageSelected = typeof window !== "undefined" ? localStorage?.getItem('i18nextLng') : undefined
  const userLanguage = !languageSelected ? (typeof navigator !== "undefined" ? navigator.language : undefined) : languageSelected
  return userLanguage && supportedLanguages.includes(userLanguage as typeof supportedLanguages[number])
    ? userLanguage
    : fallbackLanguage
}

export const initI18n = (): Promise<void> => {
  return i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: supportedLanguages as unknown as string[],
      lng: detectedLanguage(),
      fallbackLng: fallbackLanguage,
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => {});
}

export default i18n