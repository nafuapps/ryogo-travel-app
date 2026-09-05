//Existing Account page
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  AuthAccountsWrapper,
  AuthActionWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { Separator } from "@/components/ui/separator"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import UserCard from "@/components/flows/auth/userCard"
import { ChevronRight } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

/*
  If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/

export default async function SignupExistingPageComponent({
  accounts,
  phone,
}: {
  accounts: FindUserAccountsByPhoneType
  phone: string
}) {
  const t = await getTranslations("Auth.SignupPage.Step2")

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
      <AuthAccountsWrapper length={accounts.length}>
        {accounts.map((account) => (
          <Link href={`/auth/login/password/${account.id}`}>
            <UserCard key={account.id} user={account} isLink />
          </Link>
        ))}
      </AuthAccountsWrapper>
      <AuthActionWrapper>
        <Link href={"/auth/signup"}>
          <RyogoOutlineButton
            size={"lg"}
            className="w-full"
            label={t("BackCTA")}
          />
        </Link>
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
      </AuthActionWrapper>
    </AuthPageWrapper>
  )
}
