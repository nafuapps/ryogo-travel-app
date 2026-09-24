import { Star } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { getAverageRating } from "@/lib/utils"

export default function RyogoAverageRatingDisplay({
  ratings,
}: {
  ratings: number[]
}) {
  return (
    <div className="border rounded-md flex items-center gap-1 lg:gap-1.5 py-0.75 lg:py-1 px-1.5 lg:px-2">
      <RyogoCaption color="slate">{getAverageRating(ratings)}</RyogoCaption>
      <RyogoIcon icon={Star} size={"xs"} />
    </div>
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
    <div className="flex gap-1 lg:gap-1.5 items-center">
      {Array.from({ length: total }).map((_, index) => {
        return (
          <RyogoIcon
            key={index + 1}
            icon={Star}
            size="sm"
            color={`${rating > index ? "yellow" : "slate"}`}
          />
        )
      })}
    </div>
  )
}
