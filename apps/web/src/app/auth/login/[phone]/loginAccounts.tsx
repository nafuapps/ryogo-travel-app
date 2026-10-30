"use client"

import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import {
  AuthContentWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3, RyogoSmall } from "@/components/typography"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginAccountsPageComponent({
  accounts,
}: {
  accounts: FindUserAccountsByPhoneType
}) {
  const t = useTranslations("Auth.LoginPage.Step2")
  const router = useRouter()
  const [clicked, setClicked] = useState<boolean>(false)

  return (
    <AuthContentWrapper
      className={`${clicked ? "animate-zoom-out" : "animate-zoom-in"}`}
    >
      <SectionColWrapper>
        <RyogoH3 color="slate" weight="font-bold">
          {t("PageTitle")}
        </RyogoH3>
        <RyogoSmall color="light">{t("Info")} </RyogoSmall>
      </SectionColWrapper>
      <SectionColWrapper>
        {accounts.map((account) => (
          <Link
            href={`/auth/login/password/${account.id}`}
            key={account.id}
            onClick={() => setClicked(true)}
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
    </AuthContentWrapper>
  )
}
