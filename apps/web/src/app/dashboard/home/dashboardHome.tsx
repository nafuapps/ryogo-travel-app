import { PageWrapper } from "@/components/page/pageWrappers"
import DashboardTripsComponent from "@/components/flows/dashboard/home/trips/dashboardTripsComponent"
import DashboardLeadsComponent from "@/components/flows/dashboard/home/leads/dashboardLeadsComponent"
import DashboardDriversComponent from "@/components/flows/dashboard/home/drivers/dashboardDriversComponent"
import DashboardVehiclesComponent from "@/components/flows/dashboard/home/vehicles/dashboardVehiclesComponent"
import DashboardRevenueComponent from "@/components/flows/dashboard/home/revenue/dashboardRevenueComponent"
import DashboardPendingPaymentsComponent from "@/components/flows/dashboard/home/payments/dashboardPendingPaymentsComponent"
import DashboardScheduleConflictsComponent from "@/components/flows/dashboard/home/schedule/dashboardScheduleConflictsComponent"
import DashboardUsersComponent from "@/components/flows/dashboard/home/users/dashboardUsersComponent"

/*
Agent:
  - Trips (starting today, ending today, ongoing - only assigned)
  - Leads (only assigned)
  - Vehicles (Available, In trip, Repair)
  - Drivers (Available, In trip, Leave)
  // - Recent activity feed
  // - Critical alerts, missions, actions (for user)
  - Pending payments (only assigned)
  - Schedule (with conflicts - only assigned)
  
  Owner:
  + Trips (overall)
  + Leads (overall)
  + Schedule (with conflicts - overall)
  + Pending payments (overall)
  - Earnings (30Days/MTD)
  - Users (with login status)

 */

export default function DashboardHomePageComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  return (
    <PageWrapper id="DashboardPage">
      <div
        id="DashboardSections"
        className="grid grid-flow-row-dense gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        <DashboardTripsComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        <DashboardLeadsComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        <DashboardVehiclesComponent agencyId={agencyId} />
        <DashboardDriversComponent agencyId={agencyId} />
        {/* <DashboardAlertsComponent userId={userId} /> */}
        {/* <DashboardActivityComponent agencyId={agencyId} /> */}
        <DashboardPendingPaymentsComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        <DashboardScheduleConflictsComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        {isOwner && <DashboardRevenueComponent agencyId={agencyId} />}
        {isOwner && <DashboardUsersComponent agencyId={agencyId} />}
      </div>
    </PageWrapper>
  )
}
