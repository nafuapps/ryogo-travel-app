"use client"

import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { User, Plus, Rows3, ChevronRight, TagX } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"
import { PhoneRegex } from "@/lib/regex"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { usePagination } from "@/hooks/usePagination"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import {
  SectionColWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

const CUSTOMERS_PER_PAGE = 4

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
      <SectionHeaderWrapper
        icon={Rows3}
        label={t("Title")}
        count={allCustomers.length}
      />
      <Link href={`/dashboard/customers/new`}>
        <RyogoOutlineButton
          size="lg"
          label={t("AddCustomer")}
          labelColor="light"
          className="w-full"
        >
          <RyogoIcon icon={Plus} size="sm" color="slate" />
        </RyogoOutlineButton>{" "}
      </Link>
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
          <RyogoOutlineButton
            type="button"
            aria-label="Clear"
            onClick={() => {
              setSearchTerm("")
              searchCustomer("")
            }}
            disabled={searchTerm.length < 0}
            label={t("Clear")}
            labelColor={searchTerm.length < 0 ? "light" : "slate"}
          />
          <RyogoDefaultButton
            aria-label="Search"
            onClick={() => searchCustomer(searchTerm)}
            label={t("Search")}
          />
        </ButtonGroup>
      </Field>
      {currentItems.length > 0 ? (
        <TileGridWrapper>
          {currentItems.map((customer) => (
            <CustomerItemComponent key={customer.id} customer={customer} />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TagX} label={t("NoCustomers")} />
      )}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </SectionWrapper>
  )
}

function CustomerItemComponent({
  customer,
}: {
  customer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.Customers.All")

  return (
    <Link href={`/dashboard/customers/${customer.id}`}>
      <SectionRowWrapper className="items-center h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
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
