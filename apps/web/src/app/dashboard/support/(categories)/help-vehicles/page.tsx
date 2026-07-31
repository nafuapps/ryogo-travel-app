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
  - Vehicles add and manage
  - Vehicle assignment and repairs
  - 

*/

export default async function SupportHelpVehiclesPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-vehicles"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpVehiclesPage">
          <SectionWrapper id="SupportHelpVehiclesMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpVehiclesSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
