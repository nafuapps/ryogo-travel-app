import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MySupportHelpVideosPage() {
  //TODO
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-videos"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpVideosPage">
          <SectionWrapper id="MySupportHelpVideosMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpVideosSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
