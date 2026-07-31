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
  - What is mission?
  - How to get and know alerts?
  - Creation and editing custom mission
  - Notification feed
  - 
*/

export default async function SupportHelpMissionsPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-missions"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpMissionsPage">
          <SectionWrapper id="SupportHelpMissionsMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpMissionsSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
