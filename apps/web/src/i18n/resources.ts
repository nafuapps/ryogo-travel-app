// Translation resources: Import your JSON files here.
import eng from "./locales/en.json"
import hin from "./locales/hi.json"
import asm from "./locales/as.json"

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof eng
  }
}

export const resources: any = {
  en: { translation: eng },
  hi: { translation: hin },
  as: { translation: asm },
}

export const supportedLngs = ["en", "hi", "as"]
