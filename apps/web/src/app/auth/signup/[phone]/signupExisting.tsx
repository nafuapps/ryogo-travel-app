//Existing Account page
import { Button } from "@/components/ui/button"
import { CaptionGrey, H2, P } from "@/components/typography"
import Link from "next/link"
import { AccountCard } from "@/app/auth/components/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

/*
  1. Get user details from DB using phone number
  2. If no account found, redirect to onboarding
  3. If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  4. If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/

export default async function SignupExistingPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const hasOwnerAccount = accounts.some(
    (p) => p.userRole == UserRolesEnum.OWNER,
  )

  const t = await getTranslations("Auth.SignupPage.Step2")

  return (
    <div
      id="SignupExistingPage"
      className="gap-4 w-full h-full flex flex-col justify-between"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll no-scrollbar">
        <P>{hasOwnerAccount ? t("InfoYes") : t("InfoNo")}</P>
        {accounts.length > 0 &&
          accounts.map((item, index) => (
            <AccountCard key={index} account={item} />
          ))}
      </div>
      <div id="SignupExistingActions" className="flex flex-col gap-4 w-full">
        {hasOwnerAccount ? (
          <>
            <Button variant={"secondary"} size={"lg"}>
              <Link href="mailto:nafuapps@gmail.com">
                {t("SecondaryCTAYes")}
              </Link>
            </Button>
            <CaptionGrey> {t("Description")}</CaptionGrey>
          </>
        ) : (
          <Button
            variant={"secondary"}
            size={"lg"}
            disabled={accounts.length < 1}
          >
            <Link href={"/onboarding"}>{t("SecondaryCTANo")}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
