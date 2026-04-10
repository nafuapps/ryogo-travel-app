//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import Image from "next/image"
import { CaptionGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const t = await getTranslations("Auth.SignupPage")

  // Redirect to private route if the user is already authenticated
  if (user) {
    if (user.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <section id="SignupLayout" className="flex flex-row w-screen h-dvh">
      <div
        id="SignupMainSection"
        className="flex flex-col gap-12 md:gap-16 justify-start items-center bg-slate-50 w-full md:w-1/2 p-6 md:p-8 lg:p-10"
      >
        <div className="relative w-40 md:w-48 aspect-2/1">
          <Image src="/logo.png" fill={true} alt={t("Logo")} />
        </div>
        {children}
      </div>
      <div id="SignupSideSection" className="md:flex md:w-1/2 relative hidden">
        <Image
          src={"/signup.png"}
          alt="Signup Page Cover Image"
          className="object-cover"
          fill
        />
      </div>
    </section>
  )
}
