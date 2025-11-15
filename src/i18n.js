// src/i18n.js
import { createI18n } from 'vue-i18n'

// استيراد ملفات JSON مباشرة (Static Import)
import en from './locals/en.json'
import ar from './locals/ar.json'

// تحديد اللغة المحفوظة أو استخدام الإنجليزية
let savedLang = 'en'
try {
  const stored = localStorage.getItem('lang')
  if (stored) savedLang = stored
} catch (e) {}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: {
    en:en,
    ar:ar
  }
})