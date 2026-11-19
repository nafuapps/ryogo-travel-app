"use client"

import CustomerItemComponent from "@/app/dashboard/customers/customerItemComponent"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { usePagination } from "@/hooks/usePagination"
import { PhoneRegex } from "@/lib/regex"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { Rows3, TagX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

const CUSTOMERS_PER_PAGE = 6

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
    <>
      <SectionWrapper id="AllCustomersSection">
        <SectionHeaderWrapper
          icon={Rows3}
          label={t("Title")}
          count={allCustomers.length}
        />
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
      </SectionWrapper>
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
    </>
  )
}
