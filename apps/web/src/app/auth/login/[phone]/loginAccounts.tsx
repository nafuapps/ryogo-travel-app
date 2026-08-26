import { RyogoH3, RyogoSmall } from "@/components/typography"
import AccountCard from "@/components/flows/auth/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.LoginPage.Step2")

  return (
    <AuthPageWrapper>
      <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
      <RyogoSmall weight="font-bold">{t("Info")}</RyogoSmall>
      <AuthAccountsWrapper length={accounts.length}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </AuthAccountsWrapper>
      <AuthActionWrapper>
        <Link href={"/auth/login"}>
          <RyogoOutlineButton
            label={t("SecondaryCTA")}
            size="lg"
            className="w-full"
          />
        </Link>
      </AuthActionWrapper>
    </AuthPageWrapper>
  )
}
