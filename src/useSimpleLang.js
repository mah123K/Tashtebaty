import { reactive } from "vue";

export const lang = reactive({
  current: localStorage.getItem("lang") || "ar",
  messages: {}
});

export const loadLang = async (code) => {
  const data = await import(`./locales/${code}.json`);
  lang.messages = data.default;
  lang.current = code;
  localStorage.setItem("lang", code);
};

// تحميل اللغة عند أول تشغيل
loadLang(lang.current);
