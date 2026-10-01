import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Track - ${pageTitle}`,
  description: pageDescription,
}

//TODO: Implement a proper track page with a dashboard and other features. For now, redirect to the booking page.
export default async function TrackPage() {
  redirect("/track/booking", RedirectType.replace)
}
