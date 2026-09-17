import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Star } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BookingRatingWrapper({
  ratingByCustomer,
  ratingByDriver,
}: {
  ratingByCustomer: number | null
  ratingByDriver: number | null
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  return (
    <SectionRowWrapper className="justify-items-stretch">
      {ratingByCustomer && (
        <BookingRatingCard
          label={t("CustomerRating")}
          rating={ratingByCustomer}
        />
      )}
      {ratingByDriver && (
        <BookingRatingCard label={t("DriverRating")} rating={ratingByDriver} />
      )}
    </SectionRowWrapper>
  )
}

function BookingRatingCard({
  label,
  rating,
}: {
  label: string
  rating: number
}) {
  return (
    <DetailsBorderWrapper>
      <DetailsHeaderWrapper>
        <RyogoCaption
          color="light"
          weight="font-normal"
          className="text-center grow"
        >
          {label}
        </RyogoCaption>
      </DetailsHeaderWrapper>
      <DetailsContentWrapper>
        <SectionRowWrapper small className="items-center justify-center">
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
        </SectionRowWrapper>
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
