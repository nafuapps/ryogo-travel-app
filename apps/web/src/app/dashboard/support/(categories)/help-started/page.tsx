import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SupportHelpStartedPage() {
  //TODO
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-started"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpStartedPage">
          <SectionWrapper id="SupportHelpStartedMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpStartedSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
