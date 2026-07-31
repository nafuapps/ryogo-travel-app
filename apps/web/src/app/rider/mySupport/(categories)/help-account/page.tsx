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
  - Account Details (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
  - Subscription (in brief)
*/

export default async function MySupportHelpAccountPage() {
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-account"} />
      <DoubleContentWrapper>
        <PageWrapper id="MySupportHelpAccountPage">
          <SectionWrapper id="MySupportHelpAccountMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="MySupportHelpAccountSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
