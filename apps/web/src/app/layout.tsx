import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { NextIntlClientProvider } from "next-intl"
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from "next"

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
  return (
    <html lang="en" className={notoSans.className}>
      <body className={` antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
