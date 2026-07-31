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
  - Details
  - Add (with invite)
  - Modify
  - Leaves
  - Driver App
  - Communication
*/

export default async function SupportHelpDriversPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-drivers"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpDriversPage">
          <SectionWrapper id="SupportHelpDriversMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpDriversSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
