import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { Hourglass } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SupportTicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //SUBSCRIPTION BLOCKER: Only premium users can access support tickets
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
  if (isBasic || agency.subscriptionExpiresOn < new Date()) {
    const t = await getTranslations("Dashboard.SupportTickets")
    return (
      <PageWrapper id="SupportTicketsBlockerPage">
        <SectionWrapper id="SupportTicketsBlockerSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {isBasic ? t("TicketsTrialWarning") : t("TicketsExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {isBasic ? t("TicketsTrialAction") : t("TicketsExpiredAction")}
          </RyogoH4>
          {currentUser.userRole === UserRolesEnum.OWNER && (
            <Link href="/dashboard/account/subscription">
              <Button variant={"brand"} size="lg">
                {isBasic
                  ? agency.hasTriedSubscription
                    ? t("BuyCTA")
                    : t("TryCTA")
                  : t("RenewCTA")}
              </Button>
            </Link>
          )}
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return children
}
