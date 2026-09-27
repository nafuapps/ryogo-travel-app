import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `My Leaves - ${pageTitle}`,
  description: pageDescription,
}

//TODO: My leaves page
export default async function MyLeavesPage() {
  return <div></div>
}
