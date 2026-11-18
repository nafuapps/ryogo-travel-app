"use client"

import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronRight, User } from "lucide-react"
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
      <SectionRowWrapper className="items-center h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
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
          <RyogoCaption color="light" weight="font-bold">
            {customer.phone}
          </RyogoCaption>
          <RyogoCaption color="slate">
            {customer.location.city + ", " + customer.location.state}
          </RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper className="h-full items-end justify-around">
          <CustomerStatusPill status={customer.status} />
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
        </SectionColWrapper>
      </SectionRowWrapper>
    </Link>
  )
}
