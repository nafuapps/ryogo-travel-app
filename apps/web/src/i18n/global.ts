// import {routing} from '@/i18n/routing';
// import {} from '@/i18n/request';
import messages from "./locales/English.json"

declare module "next-intl" {
  interface AppConfig {
    // Locale: (typeof routing.locales)[number];
    Messages: typeof messages
    // Formats: typeof formats;
  }
}
