import { redirect, RedirectType } from "next/navigation"

export default function ResourceBlogPage() {
  redirect("/resources#blogs", RedirectType.replace)
}
