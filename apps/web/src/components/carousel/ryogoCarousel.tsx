import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { RyogoCaption } from "@/components/typography"
import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

export function RyogoCarouselWrapper({
  children,
  count,
}: {
  children: React.ReactNode
  count?: string
}) {
  return (
    <Carousel className="w-full" opts={{}}>
      <ScrollZoomIn className="w-full">
        <SectionRowWrapper className="items-center justify-center mb-4 md:mb-5">
          <CarouselPrevious className="static translate-y-0 translate-x-0 rounded-lg" />
          {count && (
            <RyogoCaption weight="font-bold" color="slate">
              {count}
            </RyogoCaption>
          )}
          <CarouselNext className="static translate-y-0 translate-x-0 rounded-lg" />
        </SectionRowWrapper>
        <CarouselContent className="mx-0 w-full">{children}</CarouselContent>
      </ScrollZoomIn>
    </Carousel>
  )
}
