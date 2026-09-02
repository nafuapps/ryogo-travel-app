import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { SectionWrapper } from "@/components/page/pageWrappers"
import {
  DashboardRow,
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardUserChipComponent from "./dashboardUserChipComponent"

export default async function DashboardUsersComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.Users")

  let users = await userServices.findAllUsersInAgency(agencyId)

  const owners = users.filter((u) => u.userRole === UserRolesEnum.OWNER)
  const agents = users.filter((u) => u.userRole === UserRolesEnum.AGENT)
  const drivers = users.filter((u) => u.userRole === UserRolesEnum.DRIVER)

  return (
    <SectionWrapper id="DashboardUsers">
      <DashboardSectionHeader title={t("Title")} href={"/dashboard/users"} />
      {owners.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader title={t("Owners")} count={owners.length} />
          {owners.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </DashboardRow>
      )}
      {agents.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader title={t("Agents")} count={agents.length} />
          {agents.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </DashboardRow>
      )}
      {drivers.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader title={t("Drivers")} count={drivers.length} />
          {drivers.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}
