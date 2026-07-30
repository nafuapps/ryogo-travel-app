import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"

//TODO
export const metadata: Metadata = {
  title: `Track - ${pageTitle}`,
  description: pageDescription,
}

export default async function TrackPage() {
  redirect("/track/booking", RedirectType.replace)
  // return <div />
}
