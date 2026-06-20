import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoH1,
  RyogoP,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight, Quote } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HomeTestimonialsSection() {
  const t = await getTranslations("Landing.Home.Testimonials")
  return (
    <LandingSectionWrapper id="testimonials" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            testimonial={t("T1.Quote")}
            name={t("T1.Name")}
            role={t("T1.Role")}
            initial={t("T1.Initial")}
            rating={5}
          />
          <TestimonialCard
            testimonial={t("T2.Quote")}
            name={t("T2.Name")}
            role={t("T2.Role")}
            initial={t("T2.Initial")}
            rating={5}
          />
          <TestimonialCard
            testimonial={t("T3.Quote")}
            name={t("T3.Name")}
            role={t("T3.Role")}
            initial={t("T3.Initial")}
            rating={5}
          />
        </div>
        <Link href="/resources">
          <Button size="lg" className="w-full md:w-auto">
            <RyogoSmall color="white" weight="font-medium">
              {t("MoreCTA")}
            </RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </Button>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function TestimonialCard({
  testimonial,
  name,
  role,
  initial,
  rating,
}: {
  testimonial: string
  name: string
  role: string
  initial: string
  rating: number
}) {
  return (
    <SectionWrapper id={name}>
      <SectionRowWrapper>
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-400">
              ⭐
            </span>
          ))}
        </div>
        <RyogoIcon icon={Quote} size="md" color="slate" />
      </SectionRowWrapper>
      <RyogoSmall color="slate" className="italic ">
        {testimonial}
      </RyogoSmall>
      <div className="mt-auto flex items-center gap-4">
        <div className="size-12 shrink-0 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
          <RyogoP weight="font-bold" color="white">
            {initial}
          </RyogoP>
        </div>
        <div className="flex flex-col">
          <RyogoSmall>{name}</RyogoSmall>
          <RyogoCaption color="light">{role}</RyogoCaption>
        </div>
      </div>
    </SectionWrapper>
  )
}
