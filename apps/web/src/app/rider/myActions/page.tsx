//Rider My actions home page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `My Actions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyActionsPage() {
  return <div></div>
}
