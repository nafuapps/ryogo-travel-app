"use client"

import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { AuthPageWrapper } from "@/components/flows/auth/authWrappers"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { Separator } from "@/components/ui/separator"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import { ChevronRight } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { useState } from "react"
import { useRouter } from "next/navigation"

/*
  If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/

export default function SignupExistingPageComponent({
  accounts,
  phone,
}: {
  accounts: FindUserAccountsByPhoneType
  phone: string
}) {
  const t = useTranslations("Auth.SignupPage.Step2")
  const router = useRouter()
  const [clicked, setClicked] = useState<string | null>(null)

  const hasOwnerAccount = accounts.some(
    (p) => p.userRole === UserRolesEnum.OWNER,
  )

  return (
    <AuthPageWrapper>
      <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
      <RyogoSmall weight="font-bold">
        {hasOwnerAccount
          ? t("InfoYes")
          : t("InfoNo", { count: accounts.length })}
      </RyogoSmall>
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
        className="w-full"
        label={t("BackCTA")}
        onClick={() => router.back()}
      />
      <Separator />
      {hasOwnerAccount ? (
        <>
          <RyogoCaption color="light" className="text-center">
            {t("Description")}
          </RyogoCaption>
          <Link href={`mailto:${SUPPORT_EMAIL}`}>
            <RyogoGhostButton
              className="w-full"
              label={t("SecondaryCTAYes")}
              labelColor="light"
            >
              <RyogoIcon icon={ChevronRight} size="sm" color="light" thick />
            </RyogoGhostButton>
          </Link>
        </>
      ) : (
        <Link href={`/onboarding?phone=${phone}`}>
          <RyogoGhostButton
            className="w-full"
            label={t("SecondaryCTANo")}
            labelColor="light"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="light" thick />
          </RyogoGhostButton>
        </Link>
      )}
    </AuthPageWrapper>
  )
}
