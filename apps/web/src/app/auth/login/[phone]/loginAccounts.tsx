import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import AccountCard from "@/components/flows/auth/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"

export default async function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.LoginPage.Step2")

  return (
    <AuthPageWrapper>
      <RyogoH3 color="slate">{t("PageTitle")} </RyogoH3>
      <RyogoSmall weight="font-bold">{t("Info")}</RyogoSmall>
      <AuthAccountsWrapper length={accounts.length}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </AuthAccountsWrapper>
      <AuthActionWrapper>
        <Link href={"/auth/login"}>
          <Button variant={"secondary"} size={"lg"} className="w-full">
            <RyogoCaption color="light">{t("SecondaryCTA")}</RyogoCaption>
          </Button>
        </Link>
      </AuthActionWrapper>
    </AuthPageWrapper>
  )
}
