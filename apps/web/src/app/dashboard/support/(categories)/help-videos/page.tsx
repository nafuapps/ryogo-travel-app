import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SupportHelpVideosPage() {
  //TODO
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-videos"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpVideosPage">
          <SectionWrapper id="SupportHelpVideosMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpVideosSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
