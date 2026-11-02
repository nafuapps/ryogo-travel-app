import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getAverageRating } from "@/lib/utils"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

export default function RyogoAverageRatingDisplay({
  ratings,
}: {
  ratings: number[]
}) {
  const t = useTranslations("Components.Rating")
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="border rounded-md flex items-center gap-1 lg:gap-1.5 py-1 lg:py-1.5 px-2 lg:px-3">
          <RyogoCaption color="slate">{getAverageRating(ratings)}</RyogoCaption>
          <RyogoIcon icon={Star} size={"xs"} thick />
        </div>
      </TooltipTrigger>
      <TooltipContent>{t("Ratings", { count: ratings.length })}</TooltipContent>
    </Tooltip>
  )
}

export function RyogoSingleRatingDisplay({
  total,
  rating,
}: {
  total: number
  rating: number
}) {
  return (
    <SectionRowWrapper small className="items-center">
      {Array.from({ length: total }).map((_, index) => {
        return (
          <RyogoIcon
            key={index + 1}
            icon={Star}
            size="sm"
            color={`${rating > index ? "yellow" : "slate"}`}
            fill
          />
        )
      })}
    </SectionRowWrapper>
  )
}
