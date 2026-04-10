import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import { AccountCard } from "@/app/auth/components/accountCard"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = await getTranslations("Auth.LoginPage.Step2")

  return (
    <div
      id="LoginAccountsPage"
      className="flex flex-col justify-center w-full gap-3 lg:gap-4 max-h-full rounded-lg shadow bg-white p-6 md:p-8"
    >
      <H4>{t("PageTitle")}</H4>
      <SmallGrey>{t("Info")}</SmallGrey>
      <div
        className={`grid grid-cols-1 ${accounts.length > 3 ? "lg:grid-cols-2" : ""} gap-3 lg:gap-4 overflow-y-scroll no-scrollbar`}
      >
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      <Link href={"/auth/login"}>
        <Button variant={"secondary"} size={"lg"} className="w-full">
          <CaptionGrey>{t("SecondaryCTA")}</CaptionGrey>
        </Button>
      </Link>
    </div>
  )
}
