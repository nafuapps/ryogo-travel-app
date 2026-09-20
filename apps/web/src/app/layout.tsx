import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { NextIntlClientProvider } from "next-intl"
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"
import { DARK_MODE_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { getLang } from "@/lib/utils"

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
})
export const metadata: Metadata = {
  title: "RyoGo Travel App",
  description: "Ryogo Travel Agency App",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RyoGo Travel App",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const lang = getLang(locale)

  const prefersDarkClassName =
    (await cookies()).get(DARK_MODE_COOKIE_NAME)?.value === "true"
      ? " dark"
      : ""

  return (
    <html
      lang={lang}
      className={notoSans.className + prefersDarkClassName}
      suppressHydrationWarning
    >
      <body className={` antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ duration: 3000 }}
        />
      </body>
    </html>
  )
}
