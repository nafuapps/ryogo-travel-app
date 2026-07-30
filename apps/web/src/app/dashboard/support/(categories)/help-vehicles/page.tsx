import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SupportHelpVehiclesPage() {
  //TODO
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
