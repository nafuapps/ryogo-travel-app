"use client"

import { RyogoH3, RyogoSmall } from "@/components/typography"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { AuthPageWrapper } from "@/components/flows/auth/authWrappers"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = useTranslations("Auth.LoginPage.Step2")
  const router = useRouter()
  const [clicked, setClicked] = useState<string | null>(null)

  return (
    <AuthPageWrapper>
      <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
      <RyogoSmall weight="font-bold">{t("Info")}</RyogoSmall>
      <SectionColWrapper>
        {accounts.map((account) => (
          <Link
            href={`/auth/login/password/${account.id}`}
            key={account.id}
            onClick={() => setClicked(account.id)}
            className={`${clicked === account.id && "animate-zoom-out"}`}
          >
            <AuthAccountCard user={account} isLink />
          </Link>
        ))}
      </SectionColWrapper>
      <RyogoOutlineButton
        label={t("SecondaryCTA")}
        className="w-full"
        onClick={() => router.back()}
      />
    </AuthPageWrapper>
  )
}
