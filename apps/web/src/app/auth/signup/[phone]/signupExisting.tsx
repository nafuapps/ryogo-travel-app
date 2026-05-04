//Existing Account page
import { Button } from "@/components/ui/button"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import Link from "next/link"
import { AccountCard } from "@/components/auth/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

/*
  If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/

export default async function SignupExistingPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.SignupPage.Step2")

  const hasOwnerAccount = accounts.some(
    (p) => p.userRole === UserRolesEnum.OWNER,
  )

  return (
    <div
      id="SignupExistingPage"
      className="flex flex-col justify-center gap-3 md:gap-4 w-full max-h-2/3 rounded-lg shadow bg-white p-6 md:p-8"
    >
      <H4>{t("PageTitle")}</H4>
      <SmallGrey>
        {hasOwnerAccount
          ? t("InfoYes")
          : t("InfoNo", { count: accounts.length })}
      </SmallGrey>
      <div
        className={`grid grid-cols-1 ${accounts.length > 3 ? "lg:grid-cols-2" : ""} gap-3 lg:gap-4 overflow-y-scroll no-scrollbar`}
      >
        {accounts.map((item, index) => (
          <AccountCard key={index} account={item} />
        ))}
      </div>
      <div id="SignupExistingActions" className="flex flex-col gap-4 w-full">
        <Link href={"/auth/signup"}>
          <Button variant={"secondary"} size={"lg"} className="w-full">
            <CaptionGrey>{t("BackCTA")}</CaptionGrey>
          </Button>
        </Link>
        {hasOwnerAccount ? (
          <>
            <Button variant={"outline"} size={"lg"}>
              <Link href="mailto:nafuapps@gmail.com">
                <CaptionGrey>{t("SecondaryCTAYes")}</CaptionGrey>
              </Link>
            </Button>
            <CaptionGrey> {t("Description")}</CaptionGrey>
          </>
        ) : (
          <Button variant={"outline"} size={"lg"}>
            <Link href={"/onboarding"}>
              <CaptionGrey>{t("SecondaryCTANo")}</CaptionGrey>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
