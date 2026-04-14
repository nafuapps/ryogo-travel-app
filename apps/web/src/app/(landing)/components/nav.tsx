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
    <nav className="bg-white shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-16 w-full">
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
                className={`${props.selected !== link.id ? "text-slate-700 hover:text-sky-600" : "text-sky-700"} font-semibold transition`}
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
            className="md:hidden"
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
                  className={`${props.selected !== link.id ? "text-slate-700 hover:text-sky-600" : "text-sky-700"} px-2 font-semibold transition`}
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
