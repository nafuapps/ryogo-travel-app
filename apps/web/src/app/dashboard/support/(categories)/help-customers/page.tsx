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
  - Adding
  - Details
  - Modifying
  - Communication
  - Search
  - 
*/

export default async function SupportHelpCustomersPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-customers"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpCustomersPage">
          <SectionWrapper id="SupportHelpCustomersMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpCustomersSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
