import { supportedLngs } from "@ryogo-travel-app/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLngs,

  // Used when no locale matches
  defaultLocale: "en",

  // no prefix for the default locale
  localePrefix: "never",
});
