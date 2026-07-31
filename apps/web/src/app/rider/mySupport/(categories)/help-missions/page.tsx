import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"

/*
TODO
  - What is mission?
  - How to get and know alerts?
  - Creation and editing custom mission
  - 
*/

export default async function MySupportHelpMissionsPage() {
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-missions"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpMissionsPage">
          <SectionWrapper id="MySupportHelpMissionsMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpMissionsSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
