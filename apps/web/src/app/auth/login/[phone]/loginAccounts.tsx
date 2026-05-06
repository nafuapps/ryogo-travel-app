import { CaptionGrey, H4Grey, SmallBold } from "@/components/typography"
import { AccountCard } from "@/components/auth/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"

export default async function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.LoginPage.Step2")

  return (
    <AuthPageWrapper>
      <H4Grey>{t("PageTitle")}</H4Grey>
      <SmallBold>{t("Info")}</SmallBold>
      <AuthAccountsWrapper length={accounts.length}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </AuthAccountsWrapper>
      <AuthActionWrapper>
        <Link href={"/auth/login"}>
          <Button variant={"secondary"} size={"lg"} className="w-full">
            <CaptionGrey>{t("SecondaryCTA")}</CaptionGrey>
          </Button>
        </Link>
      </AuthActionWrapper>
    </AuthPageWrapper>
  )
}
