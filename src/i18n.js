import { createI18n } from "vue-i18n";

// Remove static imports from /public — we will load them at runtime
// ...existing code...

// Safe language retrieval
let savedLang = "ar"; // default
try {
  const stored = localStorage.getItem("lang");
  if (stored) savedLang = stored;
} catch (error) {
  console.warn("LocalStorage not accessible:", error);
}

// Create i18n with empty messages, then load JSON files at runtime
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: "en",
  messages: {}, // will populate after fetch
});

// Async loader — loads JSON from the public folder (/locals/*.json)
async function loadLocaleFiles() {
  try {
    const paths = {
      en: "/locals/en.json",
      ar: "/locals/ar.json",
    };

    const promises = Object.entries(paths).map(async ([key, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const data = await res.json();
        i18n.global.setLocaleMessage(key, data);
        return true;
      } catch (err) {
        console.warn("i18n fetch error for", url, err);
        return false;
      }
    });

    await Promise.all(promises);

    // If current locale not loaded, fallback to 'en' if available
    if (!i18n.global.availableLocales.includes(i18n.global.locale)) {
      if (i18n.global.availableLocales.includes("en")) {
        i18n.global.locale = "en";
      }
    }
  } catch (err) {
    console.error("Failed to load locale files:", err);
  }
}

// Start loading immediately (no await needed here)
loadLocaleFiles();

export default i18n;