import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources: Import your JSON files here.
import en from "./locales/en.json";
import hi from "./locales/hi.json";

export const resources: any = {
  en: { translation: en },
  hi: { translation: hi },
};

export const supportedLngs = ["en", "hi"];

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
