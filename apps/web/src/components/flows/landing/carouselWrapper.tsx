import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselWrapper({
  children,
  count,
}: {
  children: React.ReactNode
  count?: string
}) {
  return (
    <Carousel className="w-full" opts={{}}>
      <div className="flex gap-2 lg:gap-3 items-center justify-center w-full mb-3">
        <CarouselPrevious className="static translate-y-0 translate-x-0" />
        {count && <RyogoCaption color="light">{count}</RyogoCaption>}
        <CarouselNext className="static translate-y-0 translate-x-0" />
      </div>
      <CarouselContent className="m-0.5 gap-3 lg:gap-4">
        {children}
      </CarouselContent>
    </Carousel>
  )
}

export function VideoCarouselItem({
  src,
  title,
  desc,
  index,
}: {
  src: string
  title: string
  desc: string
  index: number
}) {
  return (
    <CarouselItem className="flex flex-col p-3 md:p-4 rounded-xl border gap-3 md:gap-4 basis-full md:basis-1/2 lg:basis-1/3">
      <RyogoVideo src={src} className="w-full aspect-video rounded-lg" />
      <RyogoSmall weight="font-bold">{title}</RyogoSmall>
      <div className="flex gap-2 md:gap-3 items-end justify-between -mt-2">
        <RyogoCaption color="light">{desc}</RyogoCaption>
        <div className="flex items-center justify-center border rounded-full size-10 lg:size-12 shrink-0">
          <RyogoSmall color="light" weight="font-bold">
            {index}
          </RyogoSmall>
        </div>
      </div>
    </CarouselItem>
  )
}
