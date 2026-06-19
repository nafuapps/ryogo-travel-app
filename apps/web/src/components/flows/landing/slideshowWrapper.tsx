"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH3, RyogoP, RyogoSmall } from "@/components/typography"
import { useSlideshow } from "@/hooks/useSlideshow"
import { SLIDESHOW_TIMER_MS } from "@/lib/uiConfig"
import { LucideIcon } from "lucide-react"
import Image from "next/image"

export type SlideshowItemType = {
  src: string
  icon: LucideIcon
  title: string
  description: string
}

export function SlideshowWrapper({
  items,
  reverse,
}: {
  items: SlideshowItemType[]
  reverse?: boolean
}) {
  const { activeIndex, timeLeft, setActiveIndex } = useSlideshow(items.length)

  return (
    <div
      className={`mt-4 flex flex-col items-center gap-6 w-full ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <SlideshowSideImageWrapper
        imageSrc={items[activeIndex]?.src ?? "/logoPWALight.png"}
      />
      <SlideshowCardList
        items={items}
        timeLeft={timeLeft}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  )
}

function SlideshowCardList({
  items,
  timeLeft,
  activeIndex,
  setActiveIndex,
}: {
  items: SlideshowItemType[]
  timeLeft: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  return (
    <div className="flex flex-col w-full">
      {items.map((item, index) => (
        <SlideshowCard
          key={index}
          item={item}
          timeLeft={timeLeft}
          active={index === activeIndex}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}

function SlideshowCard({
  item,
  timeLeft,
  active,
  onClick,
}: {
  item: SlideshowItemType
  timeLeft: number
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      className="flex flex-col px-2 lg:px-3 pt-1 lg:pt-2 pb-4 lg:pb-5 gap-4 lg:gap-5 w-full transition duration-500"
      onClick={onClick}
    >
      <div className="flex gap-3 lg:gap-4 items-center">
        <RyogoIcon
          icon={item.icon}
          size={active ? "lg" : "md"}
          color={active ? "brand" : "light"}
        />
        {active ? (
          <RyogoH3 weight="font-bold" color="dark">
            {item.title}
          </RyogoH3>
        ) : (
          <RyogoP weight="font-bold" color="light">
            {item.title}
          </RyogoP>
        )}
      </div>
      {active && (
        <div className="flex flex-col gap-3 lg:gap-4 transition duration-500">
          <RyogoSmall color="slate">{item.description}</RyogoSmall>
          <div className="flex md:hidden aspect-4/5 rounded-lg overflow-hidden relative">
            <SlideshowImage imageSrc={item.src} />
          </div>
        </div>
      )}
      {active ? (
        <div className="rounded w-full h-0.5 lg:h-1 bg-white">
          <div
            className="h-full rounded bg-sky-700"
            style={{ width: `${(timeLeft / SLIDESHOW_TIMER_MS) * 100}%` }}
          />
        </div>
      ) : (
        <div className="w-full h-px lg:h-0.5 rounded bg-slate-200" />
      )}
    </div>
  )
}

function SlideshowSideImageWrapper({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="hidden md:flex w-full aspect-4/5 rounded-lg overflow-hidden relative">
      <SlideshowImage imageSrc={imageSrc} />
    </div>
  )
}

function SlideshowImage({ imageSrc }: { imageSrc: string }) {
  return (
    <Image
      className="object-cover w-full"
      loading="eager"
      src={imageSrc}
      alt=""
      fill
      sizes="768px"
    />
  )
}
