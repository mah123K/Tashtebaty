import { createI18n } from "vue-i18n";

let savedLang = "ar";
try {
  const stored = localStorage.getItem("lang");
  if (stored) savedLang = stored;
} catch (e) {}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: "en",
  messages: {},
});


const getCurrentLocale = () => {
  const loc = i18n.global.locale;
  if (typeof loc === "string") return loc;
  if (loc && typeof loc === "object" && "value" in loc) return loc.value;
  return "";
};

const getAvailableLocales = () => {
  const al = i18n.global.availableLocales;
  if (Array.isArray(al)) return al;
  if (al && typeof al === "object" && "value" in al) return al.value;
  if (typeof al === "function") return al();
  return [];
};

const setLocale = (l) => {
  const loc = i18n.global.locale;
  if (typeof loc === "string") i18n.global.locale = l;
  else if (loc && "value" in loc) loc.value = l;
  else i18n.global.locale = l;
};

async function loadLocaleFiles() {
  try {
    const paths = {
      en: "/locals/en.json",
      ar: "/locals/ar.json",
    };

    await Promise.all(
      Object.entries(paths).map(async ([key, url]) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const data = await res.json();
        i18n.global.setLocaleMessage(key, data);
      })
    );

    const locales = getAvailableLocales();
    const current = getCurrentLocale();
    if (!locales.includes(current)) {
      if (locales.includes("en")) setLocale("en");
      else if (locales.length) setLocale(locales[0]);
    }
  } catch (err) {
    console.error("Failed to load locale files:", err);
  }
}

loadLocaleFiles();

export default i18n;
