import { getRequestConfig } from "next-intl/server";
import { resources } from "@ryogo-travel-app/i18n";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";

  return {
    locale,
    messages: resources[locale].translation,
  };
});
