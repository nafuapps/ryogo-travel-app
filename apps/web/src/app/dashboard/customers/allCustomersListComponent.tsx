"use client"

import {
  PGrey,
  H5Grey,
  Caption,
  PBold,
  CaptionBold,
} from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { LucideRows3, LucideUser } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "../components/pageCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getCustomerStatusColor } from "../components/customers/customerCommon"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"
import { PhoneRegex } from "@/lib/regex"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { usePagination } from "@/hooks/usePagination"

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
    if (term == "") {
      setDisplayedCustomers(allCustomers)
    } else if (PhoneRegex.safeParse(term).success) {
      setDisplayedCustomers(allCustomers.filter((c) => c.phone == term))
    } else {
      setDisplayedCustomers(allCustomers.filter((c) => c.name.includes(term)))
    }
  }

  return (
    <div id="AllCustomersSection" className={sectionClassName}>
      <div id="AllCustomersHeader" className={sectionHeaderClassName}>
        <LucideRows3 className={iconClassName} />
        <PGrey>{t("Title")}</PGrey>
        <H5Grey>{allCustomers.length}</H5Grey>
      </div>
      <Link href={`/dashboard/customers/new`} className="min-w-1/2 self-center">
        <Button variant={"default"} className="w-full">
          {t("AddCustomer")}
        </Button>
      </Link>
      <Field>
        <ButtonGroup>
          <Input
            id="input-button-group"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => {
              if (e.target.value == "") {
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
    </div>
  )
}

function AllCustomersItemComponent({
  customer,
}: {
  customer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.Customers.All")

  const bgColor = getCustomerStatusColor(customer.status)

  return (
    <Link href={`/dashboard/customers/${customer.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {customer.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(customer.photoUrl)}
                alt={t("Photo") + " " + customer.id}
                fill
                sizes="(max-width: 768px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </div>
        <div className={gridItemClassName}>
          <Caption>{customer.phone}</Caption>
          <PBold>{customer.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{customer.location.state}</Caption>
          <PBold>{customer.location.city}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{customer.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}
