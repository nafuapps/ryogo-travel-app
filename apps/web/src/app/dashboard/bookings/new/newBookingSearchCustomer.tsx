/* eslint-disable react-hooks/immutability */
"use client"

import { useState } from "react"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import ExistingCutomerCard from "@/components/flows/bookings/new/existingCustomerCard"
import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight } from "lucide-react"
import {
  FormContentWrapper,
  FormWrapper,
  GridWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { PHONE_LENGTH } from "@/lib/uiConfig"

export default function NewBookingSearchCustomerPageComponent({
  customers,
  onClick,
}: {
  customers: FindCustomersInAgencyType
  onClick: () => void
}) {
  const [searchingDone, setSearchingDone] = useState(false)

  const t = useTranslations("Dashboard.NewBooking")

  //State to maintain customers found by phone search
  const [foundCustomers, setFoundCustomers] =
    useState<FindCustomersInAgencyType>([])

  const searchCustomerSchema = z.object({
    enteredPhone: z
      .string()
      .trim()
      .min(4, t("Error1"))
      .max(PHONE_LENGTH, t("Error2"))
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
    setSearchingDone(true)
    const foundCustomers = customers.filter((c) =>
      c.phone.includes(values.enteredPhone),
    )

    //Show found customers
    setFoundCustomers(foundCustomers)
  }

  function reset() {
    form.reset()
    setSearchingDone(false)
    setFoundCustomers([])
  }

  const phone = form.watch("enteredPhone")

  return (
    <PageWrapper id="SearchCustomerStep">
      <FormWrapper<SearchCustomerType>
        id="SearchCustomerForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
        <FormContentWrapper>
          <RyogoInput
            name="enteredPhone"
            label={t("Phone")}
            placeholder={t("Placeholder")}
            type="tel"
          />
        </FormContentWrapper>
        {foundCustomers.length > 0 && (
          <>
            <RyogoSmall
              className="text-center"
              color="light"
              weight="font-medium"
            >
              {t("Found", { count: foundCustomers.length })}
            </RyogoSmall>
            <GridWrapper id="ExistingCustomersGrid" overflowScroll>
              {foundCustomers.map((c) => (
                <ExistingCutomerCard key={c.id} existingCustomer={c} />
              ))}
            </GridWrapper>
          </>
        )}
        {foundCustomers.length === 0 && searchingDone && (
          <RyogoSmall
            className="text-center"
            color="light"
            weight="font-medium"
          >
            {t("NotFound")}
          </RyogoSmall>
        )}
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            label={t("SearchCTA")}
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={reset}
            disabled={!phone || phone.length < 1 || form.formState.isSubmitting}
            label={t("ClearCTA")}
          />
          <RyogoGhostButton
            type="button"
            onClick={onClick}
            disabled={form.formState.isSubmitting}
            label={t("CreateCTA")}
            labelColor="light"
            labelClassName="font-bold"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="light" thick />
          </RyogoGhostButton>
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
