//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import Image from "next/image"
import RyoGoLogo from "@/components/logo"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to private route if the user is already authenticated
  if (user) {
    if (user.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <section id="LoginLayout" className="flex flex-row w-screen h-dvh">
      <div id="LoginSideSection" className="md:flex md:w-1/2 relative hidden">
        <Image
          loading="eager"
          src={"/login.png"}
          alt="Login Page Cover Image"
          className="object-cover"
          fill
          sizes="50vw"
        />
      </div>
      <div
        id="LoginMainSection"
        className="flex flex-col gap-12 md:gap-16 h-full items-center justify-start bg-slate-50 w-full md:w-1/2 p-6 md:p-8 lg:p-10"
      >
        <RyoGoLogo />
        {children}
      </div>
    </section>
  )
}
