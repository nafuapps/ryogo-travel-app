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

export default async function HomeTestimonialsSection() {
  const t = await getTranslations("Landing.Home.Testimonials")
  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-white min-h-lvh"
    >
      <div className="max-w-6xl mx-auto flex flex-col justify-center items-center gap-6 md:gap-8">
        <RyogoH1 weight="font-bold" extraClassName="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" extraClassName="text-center max-w-4xl">
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
            <ChevronRight className="text-white size-5 lg:size-6" />
          </Button>
        </Link>
      </div>
    </section>
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
      <RyogoSmall color="slate" extraClassName="italic ">
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
