"use client"

import CustomerItemComponent from "@/app/dashboard/customers/customerItemComponent"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { SearchBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import DriverItemComponent from "@/components/flows/drivers/home/driverItemComponent"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"
import VehicleItemComponent from "@/components/flows/vehicles/home/vehicleItemComponent"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  FormWrapper,
  PageWrapper,
  SectionColWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoCaption } from "@/components/typography"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { usePagination } from "@/hooks/usePagination"
import {
  BookingIdRegex,
  CustomerIdRegex,
  DriverIdRegex,
  VehicleIdRegex,
} from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"
import { History, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const SEARCH_KEY = "recent_searches"
const MAX_SEARCHES = 5
const BOOKINGS_PER_PAGE = 20

type SearchDataType = FindAgencySearchDataType

enum SearchTypeEnum {
  Bookings = "Bookings",
  Drivers = "Drivers",
  Vehicles = "Vehicles",
  Customers = "Customers",
}
export default function SearchPageComponent({
  searchData,
  isPremium,
  subscriptionExpiresOn,
  hasTriedSubscription,
}: {
  searchData: SearchDataType
  isPremium: boolean
  subscriptionExpiresOn: Date
  hasTriedSubscription: boolean
}) {
  const t = useTranslations("Dashboard.Search")

  const [selectedSearchType, setSelectedSearchType] = useState<SearchTypeEnum>(
    SearchTypeEnum.Bookings,
  )

  const [recentSearches, setRecentSearches] = useState<string[] | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!recentSearches) {
        const storedValue: string[] = JSON.parse(
          localStorage.getItem(SEARCH_KEY) ?? "[]",
        )
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(storedValue)
      } else {
        localStorage.setItem(SEARCH_KEY, JSON.stringify(recentSearches))
      }
    }
  }, [recentSearches])

  const [searchResultType, setSearchResultType] =
    useState<SearchTypeEnum | null>(null)
  const [bookingSearchResultSet, setBookingSearchResultSet] = useState<
    SearchDataType["bookings"]
  >([])
  const [driverSearchResultSet, setDriverSearchResultSet] = useState<
    SearchDataType["drivers"]
  >([])
  const [customerSearchResultSet, setCustomerSearchResultSet] = useState<
    SearchDataType["customers"]
  >([])
  const [vehicleSearchResultSet, setVehicleSearchResultSet] = useState<
    SearchDataType["vehicles"]
  >([])

  //Pagination hook
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(bookingSearchResultSet, BOOKINGS_PER_PAGE)

  const searchSchema = z.object({
    searchTerm: z
      .string()
      .min(3, t("Field1.Error1"))
      .max(20, t("Field1.Error2")),
  })
  type SearchType = z.infer<typeof searchSchema>

  const formData = useForm<SearchType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  })

  function getDriverSearchData(searchTerm: string) {
    if (DriverIdRegex.safeParse(searchTerm).success) {
      return searchData.drivers.filter((d) => d.id === searchTerm)
    } else {
      return searchData.drivers.filter((d) => {
        return hasTerm(searchTerm, [
          d.licenseNumber ?? "",
          d.address ?? "",
          d.name,
          d.phone,
          d.status,
        ])
      })
    }
  }

  function getVehicleSearchData(searchTerm: string) {
    if (VehicleIdRegex.safeParse(searchTerm).success) {
      return searchData.vehicles.filter((v) => v.id === searchTerm)
    } else {
      return searchData.vehicles.filter((v) => {
        return hasTerm(searchTerm, [
          v.brand,
          v.color,
          v.model,
          v.type,
          v.vehicleNumber,
          v.status,
        ])
      })
    }
  }
  function getCustomerSearchData(searchTerm: string) {
    if (CustomerIdRegex.safeParse(searchTerm).success) {
      return searchData.customers.filter((c) => c.id === searchTerm)
    } else {
      return searchData.customers.filter((c) => {
        return hasTerm(searchTerm, [
          c.address ?? "",
          c.email ?? "",
          c.location.city,
          c.location.state,
          c.name,
          c.phone,
          c.remarks ?? "",
          c.status,
        ])
      })
    }
  }

  function getBookingSearchData(searchTerm: string) {
    if (BookingIdRegex.safeParse(searchTerm).success) {
      return searchData.bookings.filter((b) => b.id === searchTerm)
    } else {
      return searchData.bookings.filter((b) => {
        return hasTerm(searchTerm, [
          b.source.city,
          b.source.state,
          b.destination.city,
          b.destination.state,
          b.assignedVehicle?.vehicleNumber ?? "",
          b.assignedVehicleId ?? "",
          b.assignedDriver?.name ?? "",
          b.assignedDriver?.phone ?? "",
          b.assignedDriverId ?? "",
          b.assignedUser.name,
          b.assignedUser.phone,
          b.assignedUserId,
          b.bookedByUser.name,
          b.bookedByUser.phone,
          b.bookedByUserId,
          b.customer.name,
          b.customer.phone,
          b.customerId,
          b.type,
          b.status,
          b.pickupAddress ?? "",
          b.dropAddress ?? "",
          b.remarks ?? "",
        ])
      })
    }
  }

  const onSubmit = async (values: SearchType) => {
    handleSearch(values.searchTerm.toUpperCase())
  }

  function handleSearch(searchTerm: string) {
    setRecentSearches((prevSearches: string[] | null) => {
      // Remove if already exists (to avoid duplicates)
      if (prevSearches) {
        const filtered = prevSearches.filter((item) => item !== searchTerm)
        // Add to the front and limit the list size
        const newSearches = [searchTerm, ...filtered].slice(0, MAX_SEARCHES)
        return newSearches
      } else {
        return [searchTerm]
      }
    })
    switch (selectedSearchType) {
      case SearchTypeEnum.Drivers:
        setSearchResultType(SearchTypeEnum.Drivers)
        setDriverSearchResultSet(getDriverSearchData(searchTerm))
        break
      case SearchTypeEnum.Vehicles:
        setSearchResultType(SearchTypeEnum.Vehicles)
        setVehicleSearchResultSet(getVehicleSearchData(searchTerm))
        break
      case SearchTypeEnum.Customers:
        setSearchResultType(SearchTypeEnum.Customers)
        setCustomerSearchResultSet(getCustomerSearchData(searchTerm))
        break
      case SearchTypeEnum.Bookings:
        setSearchResultType(SearchTypeEnum.Bookings)
        setBookingSearchResultSet(getBookingSearchData(searchTerm))
    }
  }

  return (
    <PageWrapper id="SearchPage">
      {(!isPremium || subscriptionExpiresOn < new Date()) && (
        <SubscriptionReminderButton
          warningText={t("BasicWarning", {
            basicDays: BASIC_SEARCH_LIMIT_DAYS,
            premiumDays: PREMIUM_SEARCH_DAYS,
          })}
          ctaText={
            isPremium
              ? t("RenewCTA")
              : hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
          }
        />
      )}
      <SectionWrapper id="SearchControls">
        <div
          id="typeSelection"
          className="flex flex-row items-center gap-1.5 lg:gap-2 w-full flex-wrap"
        >
          <SearchOption
            searchType={SearchTypeEnum.Bookings}
            selectedSearchType={selectedSearchType}
            setSelectedSearchType={setSelectedSearchType}
          />
          <SearchOption
            searchType={SearchTypeEnum.Drivers}
            selectedSearchType={selectedSearchType}
            setSelectedSearchType={setSelectedSearchType}
          />
          <SearchOption
            searchType={SearchTypeEnum.Vehicles}
            selectedSearchType={selectedSearchType}
            setSelectedSearchType={setSelectedSearchType}
          />
          <SearchOption
            searchType={SearchTypeEnum.Customers}
            selectedSearchType={selectedSearchType}
            setSelectedSearchType={setSelectedSearchType}
          />
        </div>
        <FormWrapper
          form={formData}
          id="SearchForm"
          onSubmit={formData.handleSubmit(onSubmit)}
        >
          <FormField
            name={"searchTerm"}
            render={({ field }) => (
              <FormItem>
                <InputGroup>
                  <InputGroupAddon>
                    <RyogoIcon icon={Search} size="sm" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder={t("Field1.Placeholder")}
                    {...field}
                  />
                  <RyogoGhostButton
                    type="button"
                    aria-label="Clear"
                    onClick={() => formData.setValue("searchTerm", "")}
                    disabled={formData.getValues("searchTerm") === ""}
                    labelColor={
                      formData.getValues("searchTerm") === ""
                        ? "light"
                        : "slate"
                    }
                    label={t("Clear")}
                  />
                  <RyogoDefaultButton
                    type="submit"
                    aria-label="Search"
                    disabled={formData.getValues("searchTerm").length < 3}
                    label={t("Search")}
                  />
                </InputGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapper>
        {recentSearches && recentSearches.length > 0 && (
          <div
            id="recentSearches"
            className="flex flex-row items-center gap-1.5 lg:gap-2 w-full flex-wrap"
          >
            <RyogoIcon icon={History} size="sm" />
            {recentSearches?.map((s) => {
              return (
                <div
                  key={s}
                  className="flex items-center justify-center rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 hover:underline bg-slate-100 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700"
                  onClick={() => {
                    formData.setValue("searchTerm", s)
                    handleSearch(s.toUpperCase())
                  }}
                >
                  <RyogoCaption color="light">{s}</RyogoCaption>
                </div>
              )
            })}
          </div>
        )}
      </SectionWrapper>
      {searchResultType === SearchTypeEnum.Bookings && (
        // Paginated booking search result
        <SectionColWrapper>
          <RyogoCaption weight="font-bold">
            {t("ResultsFound", {
              count: bookingSearchResultSet.length,
              type: "booking",
            })}
          </RyogoCaption>
          {bookingSearchResultSet.length > 0 && (
            <>
              <TileGridWrapper>
                {currentItems.map((b) => {
                  return <SearchBookingCard key={b.id} booking={b} />
                })}
              </TileGridWrapper>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </SectionColWrapper>
      )}
      {searchResultType === SearchTypeEnum.Customers && (
        <SectionColWrapper>
          <RyogoCaption weight="font-bold">
            {t("ResultsFound", {
              count: customerSearchResultSet.length,
              type: "customer",
            })}
          </RyogoCaption>
          {customerSearchResultSet.length > 0 && (
            <TileGridWrapper>
              {customerSearchResultSet.map((c) => {
                return <CustomerItemComponent key={c.id} customer={c} />
              })}
            </TileGridWrapper>
          )}
        </SectionColWrapper>
      )}
      {searchResultType === SearchTypeEnum.Vehicles && (
        <SectionColWrapper>
          <RyogoCaption weight="font-bold">
            {t("ResultsFound", {
              count: vehicleSearchResultSet.length,
              type: "vehicle",
            })}
          </RyogoCaption>
          {vehicleSearchResultSet.length > 0 && (
            <TileGridWrapper>
              {vehicleSearchResultSet.map((v) => {
                return <VehicleItemComponent key={v.id} vehicle={v} />
              })}
            </TileGridWrapper>
          )}
        </SectionColWrapper>
      )}
      {searchResultType === SearchTypeEnum.Drivers && (
        <SectionColWrapper>
          <RyogoCaption weight="font-bold">
            {t("ResultsFound", {
              count: driverSearchResultSet.length,
              type: "driver",
            })}
          </RyogoCaption>
          {driverSearchResultSet.length > 0 && (
            <TileGridWrapper>
              {driverSearchResultSet.map((d) => {
                return <DriverItemComponent key={d.id} driver={d} />
              })}
            </TileGridWrapper>
          )}
        </SectionColWrapper>
      )}
    </PageWrapper>
  )
}

function SearchOption({
  searchType,
  selectedSearchType,
  setSelectedSearchType,
}: {
  searchType: SearchTypeEnum
  selectedSearchType: SearchTypeEnum
  setSelectedSearchType: Dispatch<SetStateAction<SearchTypeEnum>>
}) {
  return (
    <div
      id={searchType}
      onClick={() => {
        setSelectedSearchType(
          searchType == selectedSearchType
            ? SearchTypeEnum.Bookings
            : searchType,
        )
      }}
      className={`flex border rounded-lg justify-center items-center p-2 lg:px-3  ${
        selectedSearchType == searchType
          ? "bg-slate-900 dark:bg-slate-50 border-slate-900 dark:border-slate-50"
          : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:cursor-pointer"
      }`}
    >
      <RyogoCaption
        color={selectedSearchType == searchType ? "white" : "slate"}
      >
        {searchType}
      </RyogoCaption>
    </div>
  )
}

//Check if the search term matches any of the list of strings
function hasTerm(searchTerm: string, list: string[]) {
  if (searchTerm === "" || list.length === 0) return false

  return list.some((value) =>
    value.toUpperCase().includes(searchTerm.toUpperCase()),
  )
}
