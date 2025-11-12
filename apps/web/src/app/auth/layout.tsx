//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import AuthMarketing from "./components/authMarketing"
import { redirect, RedirectType } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to private route if the user is authenticated
  if (user?.userId) {
    if (user.userRole == "driver") {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <section id="AuthLayout" className="flex flex-row w-screen h-dvh">
      <AuthMarketing />
      <div
        id="AuthMainSection"
        className="flex bg-white w-full h-full md:h-full md:w-1/2 px-6 md:px-8 lg:px-10 py-10 lg:py-12"
      >
        {children}
      </div>
    </section>
  )
}
