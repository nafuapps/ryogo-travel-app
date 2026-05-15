import { RyoGoLightLogo } from "@/components/logo"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Footer() {
  const t = await getTranslations("Landing.Footer")
  return (
    <footer className="bg-sky-950 text-sky-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <SectionColWrapper>
            <RyoGoLightLogo />
            <RyogoSmall color="white">{t("LogoCaption")}</RyogoSmall>
          </SectionColWrapper>

          {/* Product */}
          <SectionColWrapper>
            <RyogoSmall color="light" weight="font-bold">
              {t("Product.Title")}
            </RyogoSmall>
            <Link href="/features" className="hover:underline transition">
              <RyogoSmall color="white">{t("Product.Features")}</RyogoSmall>
            </Link>
            <Link href="/pricing" className="hover:underline transition">
              <RyogoSmall color="white">{t("Product.Pricing")}</RyogoSmall>
            </Link>
            <Link href="/how-it-works" className="hover:underline transition">
              <RyogoSmall color="white">{t("Product.HowItWorks")}</RyogoSmall>
            </Link>
            <Link href="/resources" className="hover:underline transition">
              <RyogoSmall color="white">{t("Product.Resources")}</RyogoSmall>
            </Link>
          </SectionColWrapper>

          {/* Support */}
          <SectionColWrapper>
            <RyogoSmall color="light" weight="font-bold">
              {t("Support.Title")}
            </RyogoSmall>
            <Link
              href={`tel:${SUPPORT_HELPLINE_NUMBER}`}
              className="hover:underline transition"
            >
              <RyogoSmall color="white">{t("Support.Customer")}</RyogoSmall>
            </Link>
            <Link href="#faq" className="hover:underline transition">
              <RyogoSmall color="white">{t("Support.FAQ")}</RyogoSmall>
            </Link>
            <Link
              href="mailto:ryogo.in@gmail.com"
              className="hover:underline transition"
            >
              <RyogoSmall color="white">{t("Support.Email")}</RyogoSmall>
            </Link>
          </SectionColWrapper>

          {/* Social Media //TODO: Add SM links */}
          <SectionColWrapper>
            <RyogoSmall color="light" weight="font-bold">
              {t("Social.Title")}
            </RyogoSmall>
            <Link href="/" className="hover:underline transition">
              <RyogoSmall color="white">{t("Social.Facebook")}</RyogoSmall>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoSmall color="white">{t("Social.Instagram")}</RyogoSmall>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoSmall color="white">{t("Social.LinkedIn")}</RyogoSmall>
            </Link>
            <Link href="/" className="hover:underline transition">
              <RyogoSmall color="white">{t("Social.YouTube")}</RyogoSmall>
            </Link>
          </SectionColWrapper>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <RyogoCaption color="white">
            {t("Copyright", { year: new Date().getFullYear() })}
          </RyogoCaption>
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
