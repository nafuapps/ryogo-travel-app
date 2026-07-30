import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MySupportHelpStartedPage() {
  //TODO
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-started"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpStartedPage">
          <SectionWrapper id="MySupportHelpStartedMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpStartedSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
