import { createI18n } from "vue-i18n";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "ar",
  fallbackLocale: "en",
  messages: {
    en:en,
    ar:ar
  }
});

export default i18n;
