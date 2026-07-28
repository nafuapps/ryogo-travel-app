import { Star } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoP, RyogoSmall } from "@/components/typography"

export default function RyogoRatingDisplay({
  label,
  ratings,
}: {
  label: string
  ratings: number[]
}) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
      <RyogoIcon icon={Star} size="sm" />
      <RyogoP weight="font-bold">
        {(ratings.reduce((a, c) => a + c, 0) / ratings.length).toFixed(1)}
      </RyogoP>
      <RyogoSmall color="slate">{label}</RyogoSmall>
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
