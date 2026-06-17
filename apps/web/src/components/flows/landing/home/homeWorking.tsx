"use client"

import { RyogoH1, RyogoH3, RyogoP, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Blocks,
  Car,
  ChevronRight,
  LucideIcon,
  Settings2,
  Share2,
  Tickets,
  Workflow,
} from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Image from "next/image"

const TIMER_IN_MILLISECONDS = 5000

export default function HomeWorkingSection() {
  const t = useTranslations("Landing.Home.Working")

  //TODO: Add product images
  const images = [
    {
      src: "/homeW0.png",
      icon: Car,
      title: t("W0.Title"),
      description: t("W0.Description"),
    },
    {
      src: "/homeW1.png",
      icon: Tickets,
      title: t("W1.Title"),
      description: t("W1.Description"),
    },
    {
      src: "/homeW2.png",
      icon: Workflow,
      title: t("W2.Title"),
      description: t("W2.Description"),
    },
    {
      src: "/homeW3.png",
      icon: Share2,
      title: t("W3.Title"),
      description: t("W3.Description"),
    },
    {
      src: "/homeW4.png",
      icon: Blocks,
      title: t("W4.Title"),
      description: t("W4.Description"),
    },
    {
      src: "/homeW5.png",
      icon: Settings2,
      title: t("W5.Title"),
      description: t("W5.Description"),
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)

  const [timeLeft, setTimeLeft] = useState(TIMER_IN_MILLISECONDS)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeLeft(TIMER_IN_MILLISECONDS)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [activeIndex])

  useEffect(() => {
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex((prev) => (prev + 1) % images.length)
      return
    }

    // Setup interval to tick down every 50ms
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 50)
    }, 50)

    // Clear interval on component unmount or re-render
    return () => clearInterval(timerId)
  }, [timeLeft, images.length])

  return (
    <section
      id="working"
      className="py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-white min-h-lvh"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:gap-8">
        <RyogoH1 weight="font-bold" color="dark" extraClassName="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" extraClassName="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="hidden md:flex w-full aspect-4/5 rounded-lg overflow-hidden relative">
            <WorkingImage imageSrc={images[activeIndex]?.src} />
          </div>
          <div className="flex flex-col w-full">
            {images.map((image, index) => (
              <WorkingCard
                key={index}
                icon={image.icon}
                title={image.title}
                description={image.description}
                imageSrc={image.src}
                timeLeft={timeLeft}
                active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
        <Link href="/how-it-works">
          <Button size="lg" className="w-full md:w-auto">
            <RyogoSmall color="white" weight="font-medium">
              {t("MoreCTA")}
            </RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="md" color="white" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

function WorkingCard({
  icon,
  title,
  description,
  imageSrc,
  timeLeft,
  active,
  onClick,
}: {
  icon: LucideIcon
  title: string
  description: string
  imageSrc: string
  timeLeft: number
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      className="flex flex-col  px-2 lg:px-3 py-4 lg:py-5 gap-4 lg:gap-5 w-full transition duration-200"
      onClick={onClick}
    >
      <div className="flex gap-3 lg:gap-4 items-center">
        <RyogoIcon
          icon={icon}
          size={active ? "lg" : "md"}
          color={active ? "brand" : "light"}
        />
        {active ? (
          <RyogoH3 weight="font-bold" color="dark">
            {title}
          </RyogoH3>
        ) : (
          <RyogoP weight="font-bold" color="light">
            {title}
          </RyogoP>
        )}
      </div>
      {active && (
        <div className="flex flex-col gap-3 lg:gap-4 transition duration-200">
          <RyogoSmall color="slate">{description}</RyogoSmall>
          <div className="flex md:hidden aspect-4/5 rounded-lg overflow-hidden relative">
            <WorkingImage imageSrc={imageSrc} />
          </div>
        </div>
      )}
      {active ? (
        <div className="rounded w-full h-0.5 bg-white">
          <div
            className="h-full rounded bg-sky-700"
            style={{ width: `${(timeLeft / TIMER_IN_MILLISECONDS) * 100}%` }}
          />
        </div>
      ) : (
        <div className="w-full h-px rounded bg-slate-200" />
      )}
    </div>
  )
}

function WorkingImage({ imageSrc }: { imageSrc: string | undefined }) {
  return (
    <Image
      className="object-cover w-full"
      loading="eager"
      // src={imageSrc??"/homeW0.png"}
      src={"/logoPWA.png"}
      alt=""
      fill
      sizes="768px"
    />
  )
}
