import { RyogoH3, RyogoSmall } from "@/components/typography"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import UserCard from "@/components/flows/auth/userCard"

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
          <Link href={`/auth/login/password/${account.id}`}>
            <UserCard key={account.id} user={account} isLink />
          </Link>
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
