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
  - Creation
  - Confirmation
  - Cancellation
  - Reconciling
  - Transactions
  - Expenses
  - Trip Logs
  - Assignment
  - Recommendations & Suggestions
  - Price & Commission
*/

export default async function SupportHelpBookingsPage() {
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-bookings"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpBookingsPage">
          <SectionWrapper id="SupportHelpBookingsMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpBookingsSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
