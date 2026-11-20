"use client"

import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { getAverageRating } from "@/lib/utils"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { MapPin, Star, User } from "lucide-react"
import Link from "next/link"

export default function CustomerItemComponent({
  customer,
}: {
  customer:
    | FindCustomersInAgencyType[number]
    | FindAgencySearchDataType["customers"][number]
}) {
  return (
    <Link href={`/dashboard/customers/${customer.id}`} prefetch={false}>
      <SectionWrapper id={customer.id} className="transition hover:opacity-70">
        <SectionRowWrapper className="items-center">
          {customer.photoUrl ? (
            <RyogoImage
              src={getFileUrl(customer.photoUrl)}
              alt={customer.name}
              imageSize="md"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="lg" />
          )}
          <SectionColWrapper className="w-full">
            <RyogoP weight="font-bold"> {customer.name}</RyogoP>
            <RyogoCaption color="light" weight="font-medium">
              {customer.phone}
            </RyogoCaption>
            <CustomerStatusPill
              status={customer.status}
              className="self-start"
            />
          </SectionColWrapper>
        </SectionRowWrapper>
        <SectionRowWrapper className="justify-between items-center">
          <RyogoTagWithoutBG
            label={customer.location.city + ", " + customer.location.state}
            icon={MapPin}
          />
          {customer.driverRatings && customer.driverRatings.length > 0 && (
            <RyogoTagWithoutBG
              label={getAverageRating(customer.driverRatings)}
              icon={Star}
            />
          )}
        </SectionRowWrapper>
      </SectionWrapper>
    </Link>
  )
}
