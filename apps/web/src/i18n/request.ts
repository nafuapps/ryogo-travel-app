import { LOCALE_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

type Locale = `${UserLangEnum}`

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale: Locale =
    (store.get(LOCALE_COOKIE_NAME)?.value as Locale) || UserLangEnum.ENGLISH

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
