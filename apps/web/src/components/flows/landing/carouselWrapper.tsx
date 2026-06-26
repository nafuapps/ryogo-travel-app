import { RyogoP } from "@/components/typography"
import RyogoVideo from "@/components/video/ryogoVideo"
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Carousel
      opts={{
        loop: false,
      }}
    >
      <div className="flex gap-2 lg:gap-3 items-center justify-center w-full mb-4">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
      <CarouselContent className="mx-2">{children}</CarouselContent>
    </Carousel>
  )
}

export function VideoCarouselItem({ title }: { title: string }) {
  return (
    <CarouselItem className="flex flex-col mx-3 p-3 md:p-4 rounded-lg border gap-4 md:gap-6 basis-full md:basis-1/2 lg:basis-1/3">
      <RyogoVideo
        src="https://player.vimeo.com/external/503102700.m3u8"
        className="w-full aspect-video rounded-lg overflow-hidden"
      />
      <RyogoP color="slate">{title}</RyogoP>
    </CarouselItem>
  )
}
