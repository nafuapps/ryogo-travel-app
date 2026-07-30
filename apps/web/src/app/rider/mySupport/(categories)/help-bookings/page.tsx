import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MySupportHelpBookingsPage() {
  //TODO
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-bookings"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpBookingsPage">
          <SectionWrapper id="MySupportHelpBookingsMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpBookingsSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
