import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { RyogoCaption } from "@/components/typography"

export function RyogoCarouselWrapper({
  children,
  count,
}: {
  children: React.ReactNode
  count?: string
}) {
  return (
    <Carousel className="w-full" opts={{}}>
      <div className="flex w-full items-center justify-center gap-2 lg:gap-3 mb-3">
        <CarouselPrevious className="static translate-y-0 translate-x-0 rounded-lg" />
        {count && (
          <RyogoCaption weight="font-bold" color="slate">
            {count}
          </RyogoCaption>
        )}
        <CarouselNext className="static translate-y-0 translate-x-0 rounded-lg" />
      </div>
      <CarouselContent className="m-0.5 gap-3 lg:gap-4 w-full">
        {children}
      </CarouselContent>
    </Carousel>
  )
}
