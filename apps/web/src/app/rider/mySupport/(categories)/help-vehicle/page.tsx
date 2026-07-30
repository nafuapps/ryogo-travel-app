import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MySupportHelpVehiclePage() {
  //TODO
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-vehicle"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpVehiclePage">
          <SectionWrapper id="MySupportHelpVehicleMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpVehicleSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
