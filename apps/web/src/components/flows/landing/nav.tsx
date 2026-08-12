"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { RyoGoLandingLogo } from "@/components/logo"
import { useLocale, useTranslations } from "next-intl"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { setLocaleAction } from "@/app/actions/setLocaleAction"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

type NavbarItemType =
  | "home"
  | "pricing"
  | "features"
  | "howItWorks"
  | "resources"

type NavLinkType = {
  navId: NavbarItemType
  href: React.ComponentProps<typeof Link>["href"]
  label: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Landing.Navbar")
  const path = usePathname()
  console.log(path)

  const navLinks: NavLinkType[] = [
    { navId: "features", href: "/features", label: t("Features") },
    { navId: "pricing", href: "/pricing", label: t("Pricing") },
    { navId: "howItWorks", href: "/how-it-works", label: t("HowItWorks") },
    { navId: "resources", href: "/resources", label: t("Resources") },
  ]

  return (
    <nav className="w-full flex flex-col items-center fixed top-6 md:top-8 lg:top-10 z-50 px-6 md:px-8 lg:px-10">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-950 border border-sky-100 dark:border-sky-900 opacity-99 shadow rounded-lg px-3 md:px-4 lg:px-5">
        <div className="flex flex-wrap justify-between items-center py-3 w-full gap-1 lg:gap-3">
          {/* Logo */}
          <Link href="/">
            <RyoGoLandingLogo alt={t("Logo")} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.navId}
                href={link.href}
                className={`${path !== link.href ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "bg-sky-100 dark:bg-sky-900"} py-2 px-3 rounded-lg transition-all duration-300`}
              >
                <RyogoSmall
                  color={path !== link.href ? "slate" : "brand"}
                  weight="font-medium"
                  className="text-nowrap"
                >
                  {link.label}
                </RyogoSmall>
              </Link>
            ))}
          </div>

          <LanguageSwitcher />

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-1.5 lg:gap-2">
            <Link href="/auth/login">
              <Button variant="outline">
                <RyogoCaption color="slate">{t("Login")}</RyogoCaption>
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="brand">
                <RyogoCaption color="white">{t("Signup")}</RyogoCaption>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <RyogoIcon icon={isOpen ? X : Menu} size="md" color="brand" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden top-12 pb-4 border-t">
            <div className="flex flex-col gap-6 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.navId}
                  href={link.href}
                  className="px-2 font-semibold transition"
                  onClick={() => setIsOpen(false)}
                >
                  <RyogoSmall color={path !== link.href ? "slate" : "brand"}>
                    {link.label}
                  </RyogoSmall>
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {/* <LanguageSwitcher /> */}
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <RyogoCaption color="slate">{t("Login")}</RyogoCaption>
                  </Button>
                </Link>
                <Link href="/auth/signup" className="w-full">
                  <Button variant="brand" className="w-full">
                    <RyogoCaption color="white">{t("Signup")}</RyogoCaption>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const locale = useLocale() as UserLangEnum

  const handleLocaleChange = (nextLocale: UserLangEnum) => {
    startTransition(async () => {
      await setLocaleAction(nextLocale)
      router.refresh()
    })
  }
  return (
    <Select
      defaultValue={locale}
      disabled={isPending}
      onValueChange={(value) => handleLocaleChange(value as UserLangEnum)}
    >
      <SelectTrigger className="ml-auto mr-2 md:mx-0 h-9 py-1.5 px-2 lg:py-2 lg:px-3 gap-2 font-medium bg-white dark:bg-slate-900 border focus:ring-sky-700 dark:focus:ring-sky-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="bg-white dark:bg-slate-900">
        {getEnumValueDisplayPairs(UserLangEnum).map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="cursor-pointer focus:bg-gray-50 dark:focus:bg-slate-900 text-gray-700 dark:text-gray-200"
          >
            <RyogoCaption color="slate">{lang.display}</RyogoCaption>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
