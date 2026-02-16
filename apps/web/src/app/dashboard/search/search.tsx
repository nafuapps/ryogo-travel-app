"use client"

import { useTranslations } from "next-intl"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { LucideHistory, LucideSearch, LucideUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Caption,
  CaptionBold,
  CaptionGrey,
  Small,
} from "@/components/typography"
import {
  gridClassName,
  gridItemClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"
import {
  BookingRegex,
  CustomerRegex,
  DriverRegex,
  VehicleRegex,
} from "@/lib/regex"
import Link from "next/link"
import Image from "next/image"
import { getVehicleIcon } from "../components/vehicles/vehicleCommon"
import { getDriverStatusColor } from "../components/drivers/driverCommon"
import { getVehicleStatusColor } from "../components/vehicles/vehicleCommon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getCustomerStatusColor } from "../components/customers/customerCommon"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"

const SEARCH_KEY = "recent_searches"
const MAX_SEARCHES = 5
const BOOKINGS_PER_PAGE = 20

enum SearchTypeEnum {
  Bookings = "Bookings",
  Drivers = "Drivers",
  Vehicles = "Vehicles",
  Customers = "Customers",
}
export default function SearchPageComponent({
  searchData,
}: {
  searchData: FindAgencySearchDataType
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
    FindAgencySearchDataType["bookings"]
  >([])
  const [driverSearchResultSet, setDriverSearchResultSet] = useState<
    FindAgencySearchDataType["drivers"]
  >([])
  const [customerSearchResultSet, setCustomerSearchResultSet] = useState<
    FindAgencySearchDataType["customers"]
  >([])
  const [vehicleSearchResultSet, setVehicleSearchResultSet] = useState<
    FindAgencySearchDataType["vehicles"]
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
    if (DriverRegex.safeParse(searchTerm).success) {
      return searchData.drivers.filter((d) => d.id === searchTerm)
    } else {
      return searchData.drivers.filter((d) => {
        return (
          d.address.toUpperCase().includes(searchTerm) ||
          d.licenseNumber.toUpperCase().includes(searchTerm) ||
          d.name.toUpperCase().includes(searchTerm) ||
          d.phone.toUpperCase().includes(searchTerm) ||
          d.status.toUpperCase().includes(searchTerm)
        )
      })
    }
  }

  function getVehicleSearchData(searchTerm: string) {
    if (VehicleRegex.safeParse(searchTerm).success) {
      return searchData.vehicles.filter((v) => v.id === searchTerm)
    } else {
      return searchData.vehicles.filter((v) => {
        return (
          v.brand.toUpperCase().includes(searchTerm) ||
          v.color.toUpperCase().includes(searchTerm) ||
          v.model.toUpperCase().includes(searchTerm) ||
          v.type.toUpperCase().includes(searchTerm) ||
          v.vehicleNumber.toUpperCase().includes(searchTerm) ||
          v.status.toUpperCase().includes(searchTerm)
        )
      })
    }
  }
  function getCustomerSearchData(searchTerm: string) {
    if (CustomerRegex.safeParse(searchTerm).success) {
      return searchData.customers.filter((c) => c.id === searchTerm)
    } else {
      return searchData.customers.filter((c) => {
        return (
          c.location.city.toUpperCase().includes(searchTerm) ||
          c.location.state.toUpperCase().includes(searchTerm) ||
          c.name.toUpperCase().includes(searchTerm) ||
          c.phone.toUpperCase().includes(searchTerm) ||
          c.remarks?.toUpperCase().includes(searchTerm) ||
          c.address?.toUpperCase().includes(searchTerm) ||
          c.email?.toUpperCase().includes(searchTerm) ||
          c.status.toUpperCase().includes(searchTerm)
        )
      })
    }
  }

  function getBookingSearchData(searchTerm: string) {
    if (BookingRegex.safeParse(searchTerm).success) {
      return searchData.bookings.filter((b) => b.id === searchTerm)
    } else {
      return searchData.bookings.filter((b) => {
        return (
          b.source.city.toUpperCase().includes(searchTerm) ||
          b.source.state.toUpperCase().includes(searchTerm) ||
          b.destination.city.toUpperCase().includes(searchTerm) ||
          b.destination.state.toUpperCase().includes(searchTerm) ||
          b.assignedVehicle?.vehicleNumber.toUpperCase().includes(searchTerm) ||
          b.assignedVehicleId?.toUpperCase().includes(searchTerm) ||
          b.assignedDriver?.name.toUpperCase().includes(searchTerm) ||
          b.assignedDriver?.phone.toUpperCase().includes(searchTerm) ||
          b.assignedDriverId?.toUpperCase().includes(searchTerm) ||
          b.assignedUser.name.toUpperCase().includes(searchTerm) ||
          b.assignedUser.phone.toUpperCase().includes(searchTerm) ||
          b.assignedUserId.toUpperCase().includes(searchTerm) ||
          b.bookedByUser.name.toUpperCase().includes(searchTerm) ||
          b.bookedByUser.phone.toUpperCase().includes(searchTerm) ||
          b.bookedByUserId.toUpperCase().includes(searchTerm) ||
          b.customer.name.toUpperCase().includes(searchTerm) ||
          b.customer.phone.toUpperCase().includes(searchTerm) ||
          b.customerId.toUpperCase().includes(searchTerm) ||
          b.type.toUpperCase().includes(searchTerm) ||
          b.status.toUpperCase().includes(searchTerm) ||
          b.pickupAddress?.toUpperCase().includes(searchTerm) ||
          b.dropAddress?.toUpperCase().includes(searchTerm) ||
          b.remarks?.toUpperCase().includes(searchTerm)
        )
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
    <div className={pageClassName}>
      <div
        id="SearchControls"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
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
                      <LucideSearch className="size-4 lg:size-5 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder={t("Field1.Placeholder")}
                      {...field}
                    />
                    <Button
                      variant="link"
                      aria-label="Clear"
                      onClick={() => formData.setValue("searchTerm", "")}
                      disabled={formData.getValues("searchTerm") === ""}
                    >
                      <CaptionGrey>{t("Clear")}</CaptionGrey>
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
            <LucideHistory className="size-5 lg:size-6 text-slate-400" />
            {recentSearches?.map((s) => {
              return (
                <div
                  key={s}
                  className="flex items-center justify-center rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 underline bg-slate-100 hover:bg-slate-200 hover:cursor-pointer"
                  onClick={() => {
                    formData.setValue("searchTerm", s)
                    handleSearch(s.toUpperCase())
                  }}
                >
                  <CaptionGrey>{s}</CaptionGrey>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {searchResultType && (
        <div
          id="SearchResults"
          className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
        >
          {searchResultType === SearchTypeEnum.Bookings ? (
            bookingSearchResultSet.length > 0 ? (
              // Paginated booking search result
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
            ) : (
              <Small>{t("NoBookingResult")}</Small>
            )
          ) : searchResultType === SearchTypeEnum.Customers ? (
            customerSearchResultSet.length > 0 ? (
              customerSearchResultSet.map((c) => {
                return <CustomerSearchResultItem key={c.id} customer={c} />
              })
            ) : (
              <Small>{t("NoCustomerResult")}</Small>
            )
          ) : searchResultType === SearchTypeEnum.Vehicles ? (
            vehicleSearchResultSet.length > 0 ? (
              vehicleSearchResultSet.map((v) => {
                return <VehicleSearchResultItem key={v.id} vehicle={v} />
              })
            ) : (
              <Small>{t("NoVehicleResult")}</Small>
            )
          ) : driverSearchResultSet.length > 0 ? (
            driverSearchResultSet.map((d) => {
              return <DriverSearchResultItem key={d.id} driver={d} />
            })
          ) : (
            <Small>{t("NoDriverResult")}</Small>
          )}
        </div>
      )}
    </div>
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
      className={`flex border rounded-lg justify-center items-center p-2 lg:px-3 hover:bg-slate-200 ${
        selectedSearchType == searchType
          ? "bg-slate-200 border-slate-400"
          : "border-slate-200"
      }`}
    >
      <Caption>{searchType}</Caption>
    </div>
  )
}

function BookingSearchResultItem({
  booking,
}: {
  booking: FindAgencySearchDataType["bookings"][number]
}) {
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{booking.id}</Caption>
          <Small>{booking.customer.name}</Small>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <Small>
            {booking.source.city + " - " + booking.destination.city}
          </Small>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.assignedVehicle?.vehicleNumber}</Caption>
          <Small>{booking.assignedDriver?.name}</Small>
        </div>
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{booking.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}

function DriverSearchResultItem({
  driver,
}: {
  driver: FindAgencySearchDataType["drivers"][number]
}) {
  const t = useTranslations("Dashboard.Drivers.All")
  const bgColor = getDriverStatusColor(driver.status)
  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {driver.user.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(driver.user.photoUrl)}
                alt={t("Photo") + " " + driver.id}
                fill
                sizes="(max-width: 768px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </div>
        <div className={gridItemClassName}>
          <CaptionGrey>{driver.id}</CaptionGrey>
          <Caption>{driver.phone}</Caption>
          <Small>{driver.name}</Small>
        </div>
        <div className={gridItemClassName}>
          <div className="flex flex-row gap-1 lg:gap-1.5">
            {driver.canDriveVehicleTypes.map((v) => {
              const IconComponent = getVehicleIcon({ vehicleType: v })
              return (
                <IconComponent
                  key={v}
                  className="text-slate-400 size-5 lg:size-6"
                />
              )
            })}
          </div>
          <Caption>{driver.address}</Caption>
          <CaptionGrey>{driver.licenseNumber}</CaptionGrey>
        </div>
        <div className={gridItemClassName}>
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{driver.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CustomerSearchResultItem({
  customer,
}: {
  customer: FindAgencySearchDataType["customers"][number]
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
          <CaptionGrey>{customer.id}</CaptionGrey>
          <Caption>{customer.phone}</Caption>
          <Small>{customer.name}</Small>
        </div>
        <div className={gridItemClassName}>
          {customer.email && <CaptionGrey>{customer.email}</CaptionGrey>}
          <Caption>{customer.location.state}</Caption>
          <Small>{customer.location.city}</Small>
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

function VehicleSearchResultItem({
  vehicle,
}: {
  vehicle: FindAgencySearchDataType["vehicles"][number]
}) {
  const t = useTranslations("Dashboard.Vehicles.All")
  const IconComponent = getVehicleIcon({ vehicleType: vehicle.type })
  const bgColor = getVehicleStatusColor(vehicle.status)

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {vehicle.vehiclePhotoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(vehicle.vehiclePhotoUrl)}
                alt={t("Photo") + " " + vehicle.vehicleNumber}
                fill
                sizes="(max-width: 768px) 40px,48px"
              />
            </div>
          ) : (
            // eslint-disable-next-line react-hooks/static-components
            <IconComponent className="text-slate-400 size-5 lg:size-6" />
          )}
        </div>
        <div className={gridItemClassName}>
          <CaptionGrey>{vehicle.id}</CaptionGrey>
          <Small>{vehicle.vehicleNumber}</Small>
        </div>
        <div className={gridItemClassName}>
          <CaptionGrey>{vehicle.color}</CaptionGrey>
          <Caption>{vehicle.brand + " " + vehicle.model}</Caption>
          <Small>{vehicle.type.toUpperCase()}</Small>
        </div>
        <div className={gridItemClassName}>
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{vehicle.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}
