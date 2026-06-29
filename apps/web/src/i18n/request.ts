import { LOCALE_COOKIE_NAME } from "@/lib/session"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = store.get(LOCALE_COOKIE_NAME)?.value || UserLangEnum.ENGLISH

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
