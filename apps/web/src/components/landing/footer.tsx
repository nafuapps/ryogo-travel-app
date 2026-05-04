import { RyoGoLightLogo } from "@/components/logo"
import { CaptionLight, SmallLight } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Footer() {
  const t = await getTranslations("Landing.Footer")
  return (
    <footer className="bg-sky-950 text-sky-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="flex flex-col gap-2 md:gap-3">
            <RyoGoLightLogo />
            <CaptionLight>{t("LogoCaption")}</CaptionLight>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-2 md:gap-3">
            <SmallLight>{t("Product.Title")}</SmallLight>
            <Link href="/features" className="hover:underline transition">
              <CaptionLight>{t("Product.Features")}</CaptionLight>
            </Link>
            <Link href="/pricing" className="hover:underline transition">
              <CaptionLight>{t("Product.Pricing")}</CaptionLight>
            </Link>
            <Link href="/how-it-works" className="hover:underline transition">
              <CaptionLight>{t("Product.HowItWorks")}</CaptionLight>
            </Link>
            <Link href="/resources" className="hover:underline transition">
              <CaptionLight>{t("Product.Resources")}</CaptionLight>
            </Link>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-2 md:gap-3">
            <SmallLight>{t("Support.Title")}</SmallLight>
            <Link href="tel:9840774089" className="hover:underline transition">
              <CaptionLight>{t("Support.Customer")}</CaptionLight>
            </Link>
            <Link href="#faq" className="hover:underline transition">
              <CaptionLight>{t("Support.FAQ")}</CaptionLight>
            </Link>
            <Link
              href="mailto:ryogo.in@gmail.com"
              className="hover:underline transition"
            >
              <CaptionLight>{t("Support.Email")}</CaptionLight>
            </Link>
          </div>

          {/* Social Media //TODO: Add SM links */}
          <div className="flex flex-col gap-2 md:gap-3">
            <SmallLight>{t("Social.Title")}</SmallLight>
            <Link href="/" className="hover:underline transition">
              <CaptionLight>{t("Social.Facebook")}</CaptionLight>
            </Link>
            <Link href="/" className="hover:underline transition">
              <CaptionLight>{t("Social.Instagram")}</CaptionLight>
            </Link>
            <Link href="/" className="hover:underline transition">
              <CaptionLight>{t("Social.LinkedIn")}</CaptionLight>
            </Link>
            <Link href="/" className="hover:underline transition">
              <CaptionLight>{t("Social.YouTube")}</CaptionLight>
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <CaptionLight>{t("Copyright")}</CaptionLight>
          <Link
            href="https://nafuapps.in"
            target="_blank"
            className="hover:underline transition"
          >
            <CaptionLight>{t("Developer")}</CaptionLight>
          </Link>
        </div>
      </div>
    </footer>
  )
}
