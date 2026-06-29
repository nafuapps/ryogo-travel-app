import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Carousel>
      <div className="flex gap-2 lg:gap-3 items-center justify-center w-full mb-3">
        <CarouselPrevious className="static translate-y-0 translate-x-0" />
        <CarouselNext className="static translate-y-0 translate-x-0" />
      </div>
      <CarouselContent className="m-1 gap-3 lg:gap-4">
        {children}
      </CarouselContent>
    </Carousel>
  )
}

export function VideoCarouselItem({
  src,
  title,
  desc,
}: {
  src: string
  title: string
  desc: string
}) {
  return (
    <CarouselItem className="flex flex-col p-3 md:p-4 rounded-xl border gap-4 md:gap-6 basis-full md:basis-1/2 lg:basis-1/3">
      <RyogoVideo src={src} className="w-full aspect-video rounded-lg" />
      <RyogoP weight="font-bold">{title}</RyogoP>
      <RyogoCaption color="light" className="-mt-2 md:-mt-3">
        {desc}
      </RyogoCaption>
    </CarouselItem>
  )
}
