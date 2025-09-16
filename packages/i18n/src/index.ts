// Translation resources: Import your JSON files here.
import en from "./locales/en.json";
import hi from "./locales/hi.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en;
  }
}

export const resources: any = {
  en: { translation: en },
  hi: { translation: hi },
};

export const supportedLngs = ["en", "hi"];
