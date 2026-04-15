import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { NextIntlClientProvider } from "next-intl"
import { Toaster } from "@/components/ui/sonner"

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
})

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
