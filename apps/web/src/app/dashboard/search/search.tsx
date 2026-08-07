"use client"

import { useTranslations } from "next-intl"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { History, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  FindAgencyByIdType,
  FindAgencySearchDataType,
} from "@ryogo-travel-app/api/services/agency.services"
import {
  BookingIdRegex,
  CustomerIdRegex,
  DriverIdRegex,
  VehicleIdRegex,
} from "@/lib/regex"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"
import {
  BookingStatusPill,
  CustomerStatusPill,
  DriverStatusPill,
  VehicleStatusPill,
} from "@/components/pills/ryogoPills"
import GetVehicleIcon, {
  GetCanDriveIcons,
} from "@/components/icons/vehicleIcon"
import {
  SectionWrapper,
  GridItemWrapper,
  HoverGridWrapper,
  PageWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import {
  BASIC_BOOKINGS_SEARCH_DAYS,
  PREMIUM_BOOKINGS_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"

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
  agency,
}: {
  searchData: SearchDataType
  agency: NonNullable<FindAgencyByIdType>
}) {
  const t = useTranslations("Dashboard.Search")

  const isPremium = agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC
  const isSubscribed = isPremium && agency.subscriptionExpiresOn > new Date()
  const hasTriedSubscription = agency.hasTriedSubscription

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
          d.licenseNumber,
          d.address,
          d.name,
          d.phone,
          d.status,
        ])
        // return (
        //   d.address.toUpperCase().includes(searchTerm) ||
        //   d.licenseNumber.toUpperCase().includes(searchTerm) ||
        //   d.name.toUpperCase().includes(searchTerm) ||
        //   d.phone.toUpperCase().includes(searchTerm) ||
        //   d.status.toUpperCase().includes(searchTerm)
        // )
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
        // return (
        //   v.brand.toUpperCase().includes(searchTerm) ||
        //   v.color.toUpperCase().includes(searchTerm) ||
        //   v.model.toUpperCase().includes(searchTerm) ||
        //   v.type.toUpperCase().includes(searchTerm) ||
        //   v.vehicleNumber.toUpperCase().includes(searchTerm) ||
        //   v.status.toUpperCase().includes(searchTerm)
        // )
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
        // return (
        //   c.location.city.toUpperCase().includes(searchTerm) ||
        //   c.location.state.toUpperCase().includes(searchTerm) ||
        //   c.name.toUpperCase().includes(searchTerm) ||
        //   c.phone.toUpperCase().includes(searchTerm) ||
        //   c.remarks?.toUpperCase().includes(searchTerm) ||
        //   c.address?.toUpperCase().includes(searchTerm) ||
        //   c.email?.toUpperCase().includes(searchTerm) ||
        //   c.status.toUpperCase().includes(searchTerm)
        // )
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
        // return (
        //   b.source.city.toUpperCase().includes(searchTerm) ||
        //   b.source.state.toUpperCase().includes(searchTerm) ||
        //   b.destination.city.toUpperCase().includes(searchTerm) ||
        //   b.destination.state.toUpperCase().includes(searchTerm) ||
        //   b.assignedVehicle?.vehicleNumber.toUpperCase().includes(searchTerm) ||
        //   b.assignedVehicleId?.toUpperCase().includes(searchTerm) ||
        //   b.assignedDriver?.name.toUpperCase().includes(searchTerm) ||
        //   b.assignedDriver?.phone.toUpperCase().includes(searchTerm) ||
        //   b.assignedDriverId?.toUpperCase().includes(searchTerm) ||
        //   b.assignedUser.name.toUpperCase().includes(searchTerm) ||
        //   b.assignedUser.phone.toUpperCase().includes(searchTerm) ||
        //   b.assignedUserId.toUpperCase().includes(searchTerm) ||
        //   b.bookedByUser.name.toUpperCase().includes(searchTerm) ||
        //   b.bookedByUser.phone.toUpperCase().includes(searchTerm) ||
        //   b.bookedByUserId.toUpperCase().includes(searchTerm) ||
        //   b.customer.name.toUpperCase().includes(searchTerm) ||
        //   b.customer.phone.toUpperCase().includes(searchTerm) ||
        //   b.customerId.toUpperCase().includes(searchTerm) ||
        //   b.type.toUpperCase().includes(searchTerm) ||
        //   b.status.toUpperCase().includes(searchTerm) ||
        //   b.pickupAddress?.toUpperCase().includes(searchTerm) ||
        //   b.dropAddress?.toUpperCase().includes(searchTerm) ||
        //   b.remarks?.toUpperCase().includes(searchTerm)
        // )
      })
    }
  }

  const onSubmit = async (data: SearchType) => {
    handleSearch(data.searchTerm.toUpperCase())
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
      default:
        setSearchResultType(SearchTypeEnum.Bookings)
        setBookingSearchResultSet(getBookingSearchData(searchTerm))
    }
  }

  return (
    <PageWrapper id="SearchPage">
      {!isSubscribed && (
        <SectionWrapper id="SubscribeAction">
          <SectionRowWrapper center>
            <RyogoCaption color="yellow">
              {t("BasicWarning", {
                basicDays: BASIC_BOOKINGS_SEARCH_DAYS,
                premiumDays: PREMIUM_BOOKINGS_SEARCH_DAYS,
              })}
            </RyogoCaption>
            <Link href="/dashboard/account/subscription">
              <Button
                variant={isSubscribed ? "brand" : "outline"}
                size="default"
              >
                {isPremium
                  ? t("RenewCTA")
                  : hasTriedSubscription
                    ? t("BuyCTA")
                    : t("TryCTA")}
              </Button>
            </Link>
          </SectionRowWrapper>
        </SectionWrapper>
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
        <Form {...formData}>
          <form
            id="SearchForm"
            onSubmit={formData.handleSubmit(onSubmit)}
            className="w-full"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      aria-label="Clear"
                      onClick={() => formData.setValue("searchTerm", "")}
                      disabled={formData.getValues("searchTerm") === ""}
                    >
                      <RyogoCaption
                        color={
                          formData.getValues("searchTerm") === ""
                            ? "light"
                            : "slate"
                        }
                      >
                        {t("Clear")}
                      </RyogoCaption>
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      aria-label="Search"
                      disabled={formData.getValues("searchTerm").length < 3}
                    >
                      {t("Search")}
                    </Button>
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
                  className="flex items-center justify-center rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 hover:underline bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
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
      {searchResultType && (
        <SectionWrapper id="SearchResults">
          {searchResultType === SearchTypeEnum.Bookings ? (
            // Paginated booking search result
            <>
              <RyogoCaption weight="font-bold">
                {t("ResultsFound", {
                  count: bookingSearchResultSet.length,
                  type: "booking",
                })}
              </RyogoCaption>
              {bookingSearchResultSet.length > 0 && (
                <>
                  {currentItems.map((b) => {
                    return <BookingSearchResultItem key={b.id} booking={b} />
                  })}
                  <div className="mt-4">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </>
          ) : searchResultType === SearchTypeEnum.Customers ? (
            <>
              <RyogoCaption weight="font-bold">
                {t("ResultsFound", {
                  count: customerSearchResultSet.length,
                  type: "customer",
                })}
              </RyogoCaption>
              {customerSearchResultSet.map((c) => {
                return <CustomerSearchResultItem key={c.id} customer={c} />
              })}
            </>
          ) : searchResultType === SearchTypeEnum.Vehicles ? (
            <>
              <RyogoCaption weight="font-bold">
                {t("ResultsFound", {
                  count: vehicleSearchResultSet.length,
                  type: "vehicle",
                })}
              </RyogoCaption>
              {vehicleSearchResultSet.map((v) => {
                return <VehicleSearchResultItem key={v.id} vehicle={v} />
              })}
            </>
          ) : (
            <>
              <RyogoCaption weight="font-bold">
                {t("ResultsFound", {
                  count: driverSearchResultSet.length,
                  type: "driver",
                })}
              </RyogoCaption>
              {driverSearchResultSet.map((d) => {
                return <DriverSearchResultItem key={d.id} driver={d} />
              })}
            </>
          )}
        </SectionWrapper>
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
          : "border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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

function BookingSearchResultItem({
  booking,
}: {
  booking: SearchDataType["bookings"][number]
}) {
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          <RyogoSmall>{booking.customer.name}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoSmall>
            {booking.source.city + " - " + booking.destination.city}
          </RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.assignedVehicle?.vehicleNumber}
          </RyogoCaption>
          <RyogoSmall>{booking.assignedDriver?.name}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <BookingStatusPill status={booking.status} />
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

function DriverSearchResultItem({
  driver,
}: {
  driver: SearchDataType["drivers"][number]
}) {
  const t = useTranslations("Dashboard.Drivers.All")
  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          {driver.user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(driver.user.photoUrl)}
              alt={t("Photo") + " " + driver.id}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="light">{driver.id}</RyogoCaption>
          <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
          <RyogoSmall>{driver.name}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
          <RyogoCaption color="slate">{driver.address}</RyogoCaption>
          <RyogoCaption color="light">{driver.licenseNumber}</RyogoCaption>
        </GridItemWrapper>
        <GridItemWrapper>
          <DriverStatusPill status={driver.status} />
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

function CustomerSearchResultItem({
  customer,
}: {
  customer: SearchDataType["customers"][number]
}) {
  const t = useTranslations("Dashboard.Customers.All")

  return (
    <Link href={`/dashboard/customers/${customer.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          {customer.photoUrl ? (
            <RyogoImage
              src={getFileUrl(customer.photoUrl)}
              alt={t("Photo") + " " + customer.id}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="light">{customer.id}</RyogoCaption>
          <RyogoCaption color="slate">{customer.phone}</RyogoCaption>
          <RyogoSmall>{customer.name}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          {customer.email && (
            <RyogoCaption color="light">{customer.email}</RyogoCaption>
          )}
          <RyogoCaption color="slate">{customer.location.state}</RyogoCaption>
          <RyogoSmall>{customer.location.city}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <CustomerStatusPill status={customer.status} />
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

function VehicleSearchResultItem({
  vehicle,
}: {
  vehicle: SearchDataType["vehicles"][number]
}) {
  const t = useTranslations("Dashboard.Vehicles.All")

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          {vehicle.vehiclePhotoUrl ? (
            <RyogoImage
              src={getFileUrl(vehicle.vehiclePhotoUrl)}
              alt={t("Photo") + " " + vehicle.vehicleNumber}
              imageSize="sm"
            />
          ) : (
            <GetVehicleIcon vehicleType={vehicle.type} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="light">{vehicle.id}</RyogoCaption>
          <RyogoSmall>{vehicle.vehicleNumber}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="light">{vehicle.color}</RyogoCaption>
          <RyogoCaption color="slate">
            {vehicle.brand + " " + vehicle.model}
          </RyogoCaption>
          <RyogoSmall>{vehicle.type.toUpperCase()}</RyogoSmall>
        </GridItemWrapper>
        <GridItemWrapper>
          <VehicleStatusPill status={vehicle.status} />
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

//Check if the search term matches any of the list of strings
function hasTerm(searchTerm: string, list: string[]) {
  if (searchTerm === "" || list.length === 0) return false

  return list.some((value) =>
    value.toUpperCase().includes(searchTerm.toUpperCase()),
  )
}
