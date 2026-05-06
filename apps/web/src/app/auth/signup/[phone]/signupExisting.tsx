//Existing Account page
import { Button } from "@/components/ui/button"
import { CaptionGrey, H4Grey, SmallBold } from "@/components/typography"
import Link from "next/link"
import { AccountCard } from "@/components/auth/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"

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
    <AuthPageWrapper>
      <H4Grey>{t("PageTitle")}</H4Grey>
      <SmallBold>
        {hasOwnerAccount
          ? t("InfoYes")
          : t("InfoNo", { count: accounts.length })}
      </SmallBold>
      <AuthAccountsWrapper length={accounts.length}>
        {accounts.map((item, index) => (
          <AccountCard key={index} account={item} />
        ))}
      </AuthAccountsWrapper>
      <AuthActionWrapper>
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
      </AuthActionWrapper>
    </AuthPageWrapper>
  )
}
