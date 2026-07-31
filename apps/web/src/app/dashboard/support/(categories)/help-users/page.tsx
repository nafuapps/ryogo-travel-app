import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

/*
  TODO
  - User roles and permissions
  - User add and manage
  - User communication

*/

export default async function SupportHelpUsersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/support", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-users"} />
      <DoubleContentWrapper>
        <PageWrapper id="SupportHelpUsersPage">
          <SectionWrapper id="SupportHelpUsersMain">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </SectionWrapper>
        </PageWrapper>
        <SideWrapper>
          <SectionWrapper id="SupportHelpUsersSide">
            <Skeleton className="h-20" />
          </SectionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
