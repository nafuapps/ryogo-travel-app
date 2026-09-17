import { LOCALE_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

export default getRequestConfig(async () => {
  const store = await cookies()
  const localeCookieValue = Object.values(UserLangEnum).find(
    (item) =>
      item.toUpperCase() === store.get(LOCALE_COOKIE_NAME)?.value.toUpperCase(),
  )
  const locale = localeCookieValue ?? UserLangEnum.ENGLISH

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
