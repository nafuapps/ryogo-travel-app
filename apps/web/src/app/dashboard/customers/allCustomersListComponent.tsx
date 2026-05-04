"use client"

import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { LucideRows3, LucideUser, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { iconClassName } from "@/components/page/pageCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"
import { PhoneRegex } from "@/lib/regex"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { usePagination } from "@/hooks/usePagination"
import { CustomerStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

const CUSTOMERS_PER_PAGE = 20

export default function AllCustomersListComponent({
  allCustomers,
}: {
  allCustomers: FindCustomersInAgencyType
}) {
  const t = useTranslations("Dashboard.Customers.All")

  //Search states
  const [displayedCustomers, setDisplayedCustomers] = useState(allCustomers)
  const [searchTerm, setSearchTerm] = useState("")

  //Pagination hook
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(displayedCustomers, CUSTOMERS_PER_PAGE)

  function searchCustomer(term: string) {
    if (term === "") {
      setDisplayedCustomers(allCustomers)
    } else if (PhoneRegex.safeParse(term).success) {
      setDisplayedCustomers(allCustomers.filter((c) => c.phone === term))
    } else {
      setDisplayedCustomers(
        allCustomers.filter((c) => {
          const upperTerm = term.toUpperCase()
          return (
            c.location.city.toUpperCase().includes(upperTerm) ||
            c.location.state.toUpperCase().includes(upperTerm) ||
            c.name.toUpperCase().includes(upperTerm) ||
            c.phone.toUpperCase().includes(upperTerm) ||
            c.remarks?.toUpperCase().includes(upperTerm) ||
            c.address?.toUpperCase().includes(upperTerm) ||
            c.email?.toUpperCase().includes(upperTerm) ||
            c.status.toUpperCase().includes(upperTerm)
          )
        }),
      )
    }
  }

  return (
    <SectionWrapper id="AllCustomersSection">
      <SectionHeaderWrapper>
        <LucideRows3 className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{allCustomers.length}</H5Grey>
        <Link href={`/dashboard/customers/new`} className="ml-auto">
          <Button variant={"outline"}>
            <Plus className="size-4 md:size-5 text-slate-700" />
            {t("AddCustomer")}
          </Button>
        </Link>
      </SectionHeaderWrapper>
      <Field>
        <ButtonGroup>
          <Input
            id="input-button-group"
            placeholder={t("Type")}
            value={searchTerm}
            onChange={(e) => {
              if (e.target.value === "") {
                searchCustomer("")
              }
              setSearchTerm(e.target.value)
            }}
          />
          <Button
            variant="outline"
            aria-label="Search"
            onClick={() => searchCustomer(searchTerm)}
          >
            {t("Search")}
          </Button>
        </ButtonGroup>
      </Field>
      {currentItems.map((customer) => (
        <AllCustomersItemComponent key={customer.id} customer={customer} />
      ))}
      <div className="mt-4">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </SectionWrapper>
  )
}

function AllCustomersItemComponent({
  customer,
}: {
  customer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.Customers.All")

  return (
    <Link href={`/dashboard/customers/${customer.id}`}>
      <GridWrapper>
        <GridItemWrapper>
          {customer.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                loading="eager"
                src={getFileUrl(customer.photoUrl)}
                alt={t("Photo") + " " + customer.id}
                fill
                sizes="(max-width: 1024px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{customer.phone}</Caption>
          <PBold>{customer.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{customer.location.state}</Caption>
          <PBold>{customer.location.city}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <CustomerStatusPill status={customer.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
