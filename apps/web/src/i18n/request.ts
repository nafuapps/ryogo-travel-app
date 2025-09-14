import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { resources } from "@ryogo-travel-app/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  // Static for now, we'll change this later
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: resources[locale].translation,
  };
});
