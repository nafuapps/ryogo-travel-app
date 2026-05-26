import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `My Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyMissionsPage() {
  return <div></div>
}
