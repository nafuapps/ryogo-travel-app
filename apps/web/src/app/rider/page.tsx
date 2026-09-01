import { redirect, RedirectType } from "next/navigation"

export default async function RiderPage() {
  redirect("/rider/home", RedirectType.replace)
}
