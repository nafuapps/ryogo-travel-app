import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from ".";

export const i18n = i18next.createInstance();

export function initI18n(lang: string = "en") {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3", // For React Native
    resources,
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
}

export default i18n;
