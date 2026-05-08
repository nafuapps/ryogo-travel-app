import { RyoGoLightLogo } from "@/components/logo"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
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
            <RyogoCaption color="white">{t("LogoCaption")}</RyogoCaption>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-2 md:gap-3">
            <RyogoSmall color="white">{t("Product.Title")}</RyogoSmall>
            <Link href="/features" className="hover:underline transition">
              <RyogoCaption color="white">{t("Product.Features")}</RyogoCaption>
            </Link>
            <Link href="/pricing" className="hover:underline transition">
              <RyogoCaption color="white">{t("Product.Pricing")}</RyogoCaption>
            </Link>
            <Link href="/how-it-works" className="hover:underline transition">
              <RyogoCaption color="white">
                {t("Product.HowItWorks")}
              </RyogoCaption>
            </Link>
            <Link href="/resources" className="hover:underline transition">
              <RyogoCaption color="white">
                {t("Product.Resources")}
              </RyogoCaption>
            </Link>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-2 md:gap-3">
            <RyogoSmall color="white">{t("Support.Title")}</RyogoSmall>
            <Link href="tel:9840774089" className="hover:underline transition">
              <RyogoCaption color="white">{t("Support.Customer")}</RyogoCaption>
            </Link>
            <Link href="#faq" className="hover:underline transition">
              <RyogoCaption color="white">{t("Support.FAQ")}</RyogoCaption>
            </Link>
            <Link
              href="mailto:ryogo.in@gmail.com"
              className="hover:underline transition"
            >
              <RyogoCaption color="white">{t("Support.Email")}</RyogoCaption>
            </Link>
          </div>

          {/* Social Media //TODO: Add SM links */}
          <div className="flex flex-col gap-2 md:gap-3">
            <RyogoSmall color="white">{t("Social.Title")}</RyogoSmall>
            <Link href="/" className="hover:underline transition">
              <RyogoCaption color="white">{t("Social.Facebook")}</RyogoCaption>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoCaption color="white">{t("Social.Instagram")}</RyogoCaption>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoCaption color="white">{t("Social.LinkedIn")}</RyogoCaption>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoCaption color="white">{t("Social.YouTube")}</RyogoCaption>
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <RyogoCaption color="white">{t("Copyright")}</RyogoCaption>
          <Link
            href="https://nafuapps.in"
            target="_blank"
            className="hover:underline transition"
          >
            <RyogoCaption color="white">{t("Developer")}</RyogoCaption>
          </Link>
        </div>
      </div>
    </footer>
  )
}
