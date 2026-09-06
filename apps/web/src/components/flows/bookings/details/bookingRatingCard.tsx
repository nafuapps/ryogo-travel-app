import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Star } from "lucide-react"

export default function BookingRatingCard({
  label,
  rating,
}: {
  label: string
  rating: number
}) {
  return (
    <div className="flex flex-col rounded-md border grow">
      <div className="bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-t-md p-2 lg:p-3">
        <RyogoCaption color="light" weight="font-normal">
          {label}
        </RyogoCaption>
      </div>
      <div className=" flex gap-1 lg:gap-1.5 items-center justify-center p-2 lg:p-3">
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <RyogoIcon
              key={index}
              icon={Star}
              size="xs"
              color={index < rating ? "yellow" : "light"}
              thick
            />
          )
        })}
      </div>
    </div>
  )
}
