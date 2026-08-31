import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionColWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import {
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
      <DashboardRowHeader title={t("Owners")} count={owners.length} />
      {owners.length > 0 && (
        <SectionColWrapper small>
          {owners.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <DashboardRowHeader title={t("Agents")} count={agents.length} />
      {agents.length > 0 && (
        <SectionColWrapper small>
          {agents.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <DashboardRowHeader title={t("Drivers")} count={drivers.length} />
      {drivers.length > 0 && (
        <SectionColWrapper small>
          {drivers.map((user, index) => (
            <DashboardUserChipComponent key={index} user={user} />
          ))}
        </SectionColWrapper>
      )}
    </SectionWrapper>
  )
}
