import { PageWrapper } from "@/components/page/pageWrappers"
import DashboardTripsComponent from "@/components/flows/dashboard/home/trips/dashboardTripsComponent"
import DashboardLeadsComponent from "@/components/flows/dashboard/home/leads/dashboardLeadsComponent"
import DashboardDriversComponent from "@/components/flows/dashboard/home/drivers/dashboardDriversComponent"
import DashboardVehiclesComponent from "@/components/flows/dashboard/home/vehicles/dashboardVehiclesComponent"
import DashboardRevenueComponent from "@/components/flows/dashboard/home/revenue/dashboardRevenueComponent"
import DashboardAlertsComponent from "@/components/flows/dashboard/home/alerts/dashboardAlertsComponent"
import DashboardPendingPaymentsComponent from "@/components/flows/dashboard/home/payments/dashboardPendingPaymentsComponent"
import DashboardScheduleComponent from "@/components/flows/dashboard/home/schedule/dashboardScheduleComponent"
import DashboardActivityComponent from "@/components/flows/dashboard/home/activity/dashboardActivityComponent"
import DashboardUsersComponent from "@/components/flows/dashboard/home/users/dashboardUsersComponent"

/*
Agent:
  - Trips (starting today, ending today, ongoing - only assigned)
  - Pending payments (only assigned)
  - Vehicles (Available, In trip, Repair)
  - Drivers (Available, In trip, Leave)
  - Critical alerts, missions, actions (for userId)
  - Recent activity feed (only assigned)
  - Schedule (with conflicts - only assigned)
  - Leads (only assigned)
  
  Owner:
  + Trips (overall)
  + Pending payments (overall)
  + Recent activity feed (overall)
  + Schedule (with conflicts - overall)
  + Leads (overall)
  - Users (with login status)
  - Earnings (30Days/MTD)

 
 - 
 * Bookings - Confirmed (Lead, In progress, Completed, Cancelled)
 * Vehicles - total (Available, In trip, Repair, Inactive)
 * Drivers - total (Available, In trip, Leave, Inactive)
 * Revenue - Last 24 hrs [based on confirmed bookings] (Transactions In/out  )
 * Ongoing trips list
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
        id="DashboardMetricsSection"
        className="grid gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
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
        <DashboardAlertsComponent agencyId={agencyId} userId={userId} />
        <DashboardPendingPaymentsComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        <DashboardActivityComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        <DashboardScheduleComponent
          agencyId={agencyId}
          userId={userId}
          isOwner={isOwner}
        />
        {isOwner && (
          <DashboardRevenueComponent agencyId={agencyId} userId={userId} />
        )}
        {isOwner && (
          <DashboardUsersComponent agencyId={agencyId} userId={userId} />
        )}
      </div>
    </PageWrapper>
  )
}
