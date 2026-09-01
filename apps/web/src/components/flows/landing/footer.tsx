import { RyoGoLightLogo } from "@/components/logo"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import {
  FB_LINK,
  IG_LINK,
  LI_LINK,
  NAFUAPPS_LINK,
  SUPPORT_CHAT_NUMBER,
  SUPPORT_EMAIL,
  SUPPORT_HELPLINE_NUMBER,
  YT_LINK,
} from "@/lib/uiConfig"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Footer() {
  const t = await getTranslations("Landing.Footer")
  return (
    <footer className="bg-sky-950 dark:bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <SectionColWrapper>
            <RyoGoLightLogo />
            <RyogoSmall color="light">{t("LogoCaption")}</RyogoSmall>
          </SectionColWrapper>

          {/* Product //TODO: Add Download PWA Link */}
          <SectionColWrapper>
            <FooterTitle title={t("Product.Title")} />
            <FooterLink href="/features" label={t("Product.Features")} />
            <FooterLink href="/pricing" label={t("Product.Pricing")} />
            <FooterLink href="/how-it-works" label={t("Product.HowItWorks")} />
            <FooterLink href="/resources" label={t("Product.Resources")} />
          </SectionColWrapper>

          {/* Support */}
          <SectionColWrapper>
            <FooterTitle title={t("Support.Title")} />
            <FooterLink href="/resources#faq" label={t("Support.FAQ")} />
            <FooterLink
              href={`tel:${SUPPORT_HELPLINE_NUMBER}`}
              label={t("Support.Call")}
              otherTab
            />
            <FooterLink
              href={`mailto:${SUPPORT_EMAIL}`}
              label={t("Support.Email")}
              otherTab
            />
            <FooterLink
              href={`https://wa.me/91${SUPPORT_CHAT_NUMBER}`}
              label={t("Support.Chat")}
              otherTab
            />
          </SectionColWrapper>

          {/* Social Media */}
          <SectionColWrapper>
            <FooterTitle title={t("Social.Title")} />
            <FooterLink href={YT_LINK} label={t("Social.YouTube")} otherTab />
            <FooterLink href={IG_LINK} label={t("Social.Instagram")} otherTab />
            <FooterLink href={FB_LINK} label={t("Social.Facebook")} otherTab />
            <FooterLink href={LI_LINK} label={t("Social.LinkedIn")} otherTab />
          </SectionColWrapper>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-700 dark:border-sky-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <RyogoCaption color="light">
            {t("Copyright", { year: new Date().getFullYear() })}
          </RyogoCaption>
          <Link
            href={NAFUAPPS_LINK}
            target="_blank"
            className="hover:underline transition"
          >
            <RyogoCaption color="light">{t("Developer")}</RyogoCaption>
          </Link>
        </div>
      </div>
    </footer>
  )
}

function FooterTitle({ title }: { title: string }) {
  return (
    <RyogoSmall color="light" weight="font-bold">
      {title}
    </RyogoSmall>
  )
}

function FooterLink({
  href,
  label,
  otherTab,
}: {
  href: React.ComponentProps<typeof Link>["href"]
  label: string
  otherTab?: boolean
}) {
  return (
    <Link
      href={href}
      className="hover:opacity-70 transition"
      target={otherTab ? "_blank" : "_self"}
    >
      <RyogoSmall color="white">{label}</RyogoSmall>
    </Link>
  )
}
