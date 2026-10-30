import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_zh_CN from "../assets/languages/zh-CN.json";
import translation_zh_TW from "../assets/languages/zh-TW.json";
import translation_en_US from "../assets/languages/en-US.json";
import translation_fr_FR from "../assets/languages/fr-FR.json";
import store from "@/redux/store";

const resources = {
  "zh-CN": {
    translation: translation_zh_CN,
  },
  "zh-TW": {
    translation: translation_zh_TW,
  },
  "en-US": {
    translation: translation_en_US,
  },
  "fr-FR": {
    translation: translation_fr_FR,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources,
    lng: store.getState().i18n.currentLanguage, // if you're using a language detector, do not define the lng option
    fallbackLng: "zh-CN",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

// 订阅 Redux store 以监听语言的变化
store.subscribe(() => {
  const language = store.getState().i18n.currentLanguage;
  console.log("Language changed to: ", language);
  i18n.changeLanguage(language);
});

export default i18n;
