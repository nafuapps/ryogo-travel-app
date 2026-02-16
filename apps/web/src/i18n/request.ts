import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { resources } from "./resources"

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = store.get("locale")?.value || "en"

  return {
    locale,
    messages: resources[locale].translation,
  }
})
