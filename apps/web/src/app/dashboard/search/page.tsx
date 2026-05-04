import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/dashboardHeader"
import SearchPageComponent from "./search"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Search - ${pageTitle}`,
  description: pageDescription,
}

export default async function SearchPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const searchData = await agencyServices.findAgencySearchData(
    currentUser.agencyId,
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/search"} />
      <SearchPageComponent searchData={searchData} />
    </div>
  )
}
