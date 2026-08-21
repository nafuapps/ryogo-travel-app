/* eslint-disable react-hooks/immutability */
"use client"

import { useState } from "react"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import ExistingCutomerCard from "@/components/flows/bookings/new/existingCustomerCard"
import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import z from "zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  NewStepTitleWrapper,
  NewStepHeaderWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
} from "@/components/form/newFormWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Plus } from "lucide-react"
import { GridWrapper } from "@/components/page/pageWrappers"

export default function NewBookingSearchCustomerPageComponent({
  customers,
  onClick,
}: {
  customers: FindCustomersInAgencyType
  onClick: () => void
}) {
  const [searchingCustomer, setSearchingCustomer] = useState(false)

  const t = useTranslations("Dashboard.NewBooking")

  //State to maintain customers found by phone search
  const [foundCustomers, setFoundCustomers] =
    useState<FindCustomersInAgencyType>([])

  const searchCustomerSchema = z.object({
    enteredPhone: z
      .string()
      .trim()
      .min(4, t("Error1"))
      .max(10, t("Error2"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type SearchCustomerType = z.infer<typeof searchCustomerSchema>

  //Form init
  const form = useForm<SearchCustomerType>({
    resolver: zodResolver(searchCustomerSchema),
    defaultValues: {
      enteredPhone: "",
    },
  })

  //Find customers by phone
  const onSubmit = (values: SearchCustomerType) => {
    setSearchingCustomer(true)
    const foundCustomers = customers.filter((c) =>
      c.phone.includes(values.enteredPhone),
    )

    //Show found customers
    setFoundCustomers(foundCustomers)
  }

  return (
    <NewStepWrapper id="SearchCustomerStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
        </NewStepTitleWrapper>
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<SearchCustomerType>
        id="SearchCustomerForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <RyogoInput
            name="enteredPhone"
            label={t("Phone")}
            placeholder={t("Placeholder")}
            type="tel"
          />
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            <RyogoCaption color="white">{t("SearchCTA")}</RyogoCaption>
          </Button>
        </NewFormContentWrapper>
        {foundCustomers.length > 0 && (
          <GridWrapper id="ExistingCustomersGrid">
            {foundCustomers.map((c) => (
              <ExistingCutomerCard key={c.id} existingCustomer={c} />
            ))}
          </GridWrapper>
        )}
        {foundCustomers.length === 0 && searchingCustomer && (
          <NewFormContentWrapper>
            <>
              <RyogoSmall className="text-center" color="light">
                {t("NotFound")}
              </RyogoSmall>
              <Button variant={"outline"} size={"lg"} onClick={onClick}>
                <RyogoIcon icon={Plus} size="sm" color="slate" />
                <RyogoCaption color="slate">{t("CreateCTA")}</RyogoCaption>
              </Button>
            </>
          </NewFormContentWrapper>
        )}
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
