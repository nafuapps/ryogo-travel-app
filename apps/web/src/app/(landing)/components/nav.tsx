"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { RyoGoLandingLogo } from "@/components/logo"
import { useTranslations } from "next-intl"
import { UrlObject } from "url"

type NavbarItemType =
  | "home"
  | "pricing"
  | "features"
  | "howItWorks"
  | "resources"

type NavLinkType = {
  id: NavbarItemType
  href: UrlObject | __next_route_internal_types__.RouteImpl<string>
  label: string
}

interface NavbarProps {
  selected: NavbarItemType
}

export default function Navbar(props: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Landing.Navbar")

  const navLinks: NavLinkType[] = [
    { id: "features", href: "/features", label: t("Features") },
    { id: "pricing", href: "/pricing", label: t("Pricing") },
    { id: "howItWorks", href: "/how-it-works", label: t("HowItWorks") },
    { id: "resources", href: "/resources", label: t("Resources") },
  ]

  return (
    <nav className="w-full flex flex-col items-center fixed top-6 md:top-8 lg:top-10 z-50 px-6 md:px-8 lg:px-10">
      <div className="w-full lg:max-w-5xl bg-white opacity-99 shadow-sm rounded-lg px-3 md:px-4 lg:px-5">
        <div className="flex justify-between items-center h-12 md:h-14 lg:h-16 w-full">
          {/* Logo */}
          <Link href="/">
            <RyoGoLandingLogo alt={t("Logo")} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center md:gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`${props.selected !== link.id ? "text-slate-700 hover:text-sky-600" : "text-sky-700"} text-sm lg:text-base font-semibold transition`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">{t("Login")}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>{t("Signup")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-sky-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden top-12 pb-4 border-t">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`${props.selected !== link.id ? "text-slate-700 hover:text-sky-600" : "text-sky-700"} text-sm px-2 font-semibold transition`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t("Login")}
                  </Button>
                </Link>
                <Link href="/auth/signup" className="w-full">
                  <Button className="w-full">{t("Signup")}</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
