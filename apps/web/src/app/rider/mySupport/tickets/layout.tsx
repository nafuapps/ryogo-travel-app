import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import {
  MainWrapper,
  PageWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { Hourglass } from "lucide-react"
import RiderHeader from "@/components/header/riderHeader"

export default async function MySupportTicketsLayout({
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
    const t = await getTranslations("Rider.MySupportTickets")
    return (
      <MainWrapper>
        <RiderHeader pathName={"/rider/mySupport/tickets"} />
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
          </SectionWrapper>
        </PageWrapper>
      </MainWrapper>
    )
  }

  return children
}
