"use client"

import { useTranslations } from "next-intl"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { LucideSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Caption, CaptionGrey } from "@/components/typography"
import { pageClassName } from "@/components/page/pageCommons"
import { Dispatch, SetStateAction, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"

enum SearchTypeEnum {
  All = "All",
  Bookings = "Bookings",
  Drivers = "Drivers",
  Vehicles = "Vehicles",
  Customers = "Customers",
  Users = "Users",
}
export default function SearchPageComponent({
  agencyId,
  currentUserId,
  isOwner,
  searchData,
}: {
  agencyId: string
  currentUserId: string
  isOwner: boolean
  searchData: FindAgencySearchDataType
}) {
  const t = useTranslations("Dashboard.Search")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams)
  const { replace } = useRouter()

  const [selectedSearchType, setSelectedSearchType] = useState<SearchTypeEnum>(
    SearchTypeEnum.All,
  )
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
      searchTerm: searchParams.get("query") ?? "",
    },
  })

  const onSubmit = async (data: SearchType) => {
    params.set("query", data.searchTerm)

    replace(`${pathname}?${params.toString()}` as any)
  }
  const clearInput = () => {
    formData.setValue("searchTerm", "")
    params.delete("query")
    replace(`${pathname}` as any)
  }

  return (
    <div className={pageClassName}>
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
                    onClick={() => clearInput()}
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
      <div
        id="typeSelection"
        className="flex flex-row gap-1.5 lg:gap-2 flex-wrap"
      >
        <SearchOption
          searchType={SearchTypeEnum.All}
          selectedSearchType={selectedSearchType}
          setSelectedSearchType={setSelectedSearchType}
        />
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
        {isOwner && (
          <SearchOption
            searchType={SearchTypeEnum.Users}
            selectedSearchType={selectedSearchType}
            setSelectedSearchType={setSelectedSearchType}
          />
        )}
      </div>
      <div
        id="SearchResults"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
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
          searchType == selectedSearchType ? SearchTypeEnum.All : searchType,
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
