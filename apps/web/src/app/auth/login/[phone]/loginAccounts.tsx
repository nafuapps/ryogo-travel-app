import { H2, P } from "@/components/typography"
import { AccountCard } from "@/app/auth/components/accountCard"
import { BackButton } from "@/app/auth/components/backButton"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"

export default async function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.LoginPage.Step2")

  return (
    <div
      id="LoginAccountsPage"
      className="gap-4 flex flex-col justify-between w-full h-full"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll no-scrollbar">
        <P>{t("Info")}</P>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      <div id="LoginAccountsActions" className="flex flex-col gap-4 w-full">
        <BackButton label={t("SecondaryCTA")} />
      </div>
    </div>
  )
}
