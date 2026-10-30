"use client"

import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  AuthContentWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
  const [clicked, setClicked] = useState<boolean>(false)

  const hasOwnerAccount = accounts.some(
    (p) => p.userRole === UserRolesEnum.OWNER,
  )

  return (
    <AuthContentWrapper
      className={`${clicked ? "animate-zoom-out" : "animate-zoom-in"}`}
    >
      <SectionColWrapper>
        <RyogoH3 color="slate" weight="font-bold">
          {t("PageTitle")}
        </RyogoH3>
        <RyogoSmall color="light">
          {hasOwnerAccount
            ? t("InfoYes")
            : t("InfoNo", { count: accounts.length })}
        </RyogoSmall>
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
              <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
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
            <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
          </RyogoGhostButton>
        </Link>
      )}
    </AuthContentWrapper>
  )
}
