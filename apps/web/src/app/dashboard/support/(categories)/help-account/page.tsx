import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Skeleton } from "@/components/ui/skeleton"
/*
  TODO
  - Account Details (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
  - Subscription
*/
export default async function SupportHelpAccountPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-account"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpAccountPage">
          <SectionWrapper id="SupportHelpAccountMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpAccountSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
