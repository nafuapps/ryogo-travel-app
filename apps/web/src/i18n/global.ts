import messages from "./locales/English.json"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"

declare module "next-intl" {
  interface AppConfig {
    Locale: UserLangEnum
    Messages: typeof messages
  }
}
