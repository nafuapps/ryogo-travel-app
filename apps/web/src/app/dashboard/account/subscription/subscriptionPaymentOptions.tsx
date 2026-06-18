"use client"

import PaymentButton from "@/components/flows/susbcription/paymentButton"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoH2,
  RyogoH3,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import {
  MONTHLY_SUBSCRIPTION_MRP,
  MONTHLY_SUBSCRIPTION_FINAL_PRICE,
  QUARTERLY_SUBSCRIPTION_MRP,
  QUARTERLY_SUBSCRIPTION_FINAL_PRICE,
  ANNUAL_SUBSCRIPTION_MRP,
  ANNUAL_SUBSCRIPTION_FINAL_PRICE,
} from "@ryogo-travel-app/api/apiConfig"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { OrderTypeEnum } from "@ryogo-travel-app/db/schema"
import { ChevronRight, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function SubscriptionPaymentOptionsComponent({
  userDetails,
  agencyDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
}) {
  const t = useTranslations("Dashboard.AccountSubscription")

  const [selectedPaymentOption, setSelectedOption] = useState<OrderTypeEnum>(
    OrderTypeEnum.ANNUAL,
  )

  return (
    <SectionWrapper id="PaymentOptions" center>
      <div className="w-full rounded-lg bg-slate-950 p-7 lg:p-8 gap-3 lg:gap-4 flex flex-col items-center justify-center text-center">
        <RyogoSmall color="light">{t("ExperiencePremium")}</RyogoSmall>
        <RyogoH2 color="white" weight="font-bold">
          {t("UpgradeJourney")}
        </RyogoH2>
        <div className="flex flex-col gap-1 lg:gap-1.5 items-center rounded-lg p-3 lg:p-4 bg-slate-100 text-center">
          <RyogoCaption weight="font-bold">{t("Testimonial")}</RyogoCaption>
          <RyogoCaption color="slate">{t("TestimonialAuthor")}</RyogoCaption>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-slate-100 rounded-lg">
        <RyogoCaption color="light">{t("ChooseYourPlan")}</RyogoCaption>
        <div className="flex flex-col w-full xl:flex-row gap-4">
          <PaymentOptionCard
            plan={OrderTypeEnum.MONTHLY}
            mrp={MONTHLY_SUBSCRIPTION_MRP}
            price={MONTHLY_SUBSCRIPTION_FINAL_PRICE}
            months={1}
            selectedOption={selectedPaymentOption}
            onClick={() => setSelectedOption(OrderTypeEnum.MONTHLY)}
          ></PaymentOptionCard>
          <PaymentOptionCard
            plan={OrderTypeEnum.QUARTERLY}
            mrp={QUARTERLY_SUBSCRIPTION_MRP}
            price={QUARTERLY_SUBSCRIPTION_FINAL_PRICE}
            months={3}
            selectedOption={selectedPaymentOption}
            onClick={() => setSelectedOption(OrderTypeEnum.QUARTERLY)}
          ></PaymentOptionCard>
          <PaymentOptionCard
            plan={OrderTypeEnum.ANNUAL}
            mrp={ANNUAL_SUBSCRIPTION_MRP}
            price={ANNUAL_SUBSCRIPTION_FINAL_PRICE}
            selectedOption={selectedPaymentOption}
            months={12}
            onClick={() => setSelectedOption(OrderTypeEnum.ANNUAL)}
            best
          ></PaymentOptionCard>
        </div>
        <PaymentButton
          agencyId={agencyDetails.id}
          userId={userDetails.id}
          plan={selectedPaymentOption}
          ownerName={userDetails.name}
          ownerEmail={userDetails.email}
          ownerPhone={userDetails.phone}
          icon={<RyogoIcon icon={ChevronRight} size="sm" color="white" thick />}
          renewLabel={t("PayCTA", {
            plan: selectedPaymentOption.toUpperCase(),
          })}
        />
      </div>
      <SectionRowWrapper small center>
        <RyogoIcon icon={Lock} size="sm" color="light" />
        <RyogoCaption color="light">{t("Secure")}</RyogoCaption>
      </SectionRowWrapper>
    </SectionWrapper>
  )
}

function getDiscountValue(mrp: number, price: number) {
  return (((mrp - price) * 100) / mrp).toFixed(0)
}

function PaymentOptionCard({
  plan,
  mrp,
  price,
  months,
  selectedOption,
  onClick,
  best,
}: {
  plan: OrderTypeEnum
  mrp: number
  price: number
  months: number
  selectedOption: OrderTypeEnum
  onClick: () => void
  best?: boolean
}) {
  const t = useTranslations("Dashboard.AccountSubscription")
  const discount = getDiscountValue(mrp, price)
  const currentlySelected = selectedOption === plan
  return (
    <div
      className={`flex w-full flex-col p-3 lg:p-4 gap-2 shadow lg:gap-3 rounded-lg justify-between transition ${currentlySelected ? "bg-sky-700" : " hover:bg-sky-200 bg-white"}`}
      onClick={onClick}
    >
      <SectionRowWrapper>
        <SectionColWrapper>
          <RyogoSmall color="light" className="line-through">
            {t("MRP", { mrp: mrp })}
          </RyogoSmall>
          <SectionRowWrapper small>
            <RyogoH3
              color={currentlySelected ? "white" : "brand"}
              weight="font-bold"
            >
              {"₹"}
            </RyogoH3>
            <RyogoH2
              color={currentlySelected ? "white" : "brand"}
              weight="font-bold"
            >
              {price}
            </RyogoH2>
          </SectionRowWrapper>
        </SectionColWrapper>
        <SectionColWrapper end justifyBetween>
          <RyogoSmall
            color={currentlySelected ? "white" : "brand"}
            weight="font-bold"
          >
            {plan.toUpperCase()}
          </RyogoSmall>
          <RyogoCaption color={currentlySelected ? "white" : "slate"}>
            {t("Save", {
              percentage: discount,
            })}
          </RyogoCaption>
        </SectionColWrapper>
      </SectionRowWrapper>
      <div
        className={`h-0.5 w-full ${currentlySelected ? "bg-white" : "bg-slate-100"}`}
      />
      <SectionRowWrapper center small>
        <RyogoCaption
          color={currentlySelected ? "white" : "brand"}
          weight="font-medium"
        >
          {t("ForMonths", { months: months })}
        </RyogoCaption>
        {best && (
          <div
            className={`flex items-center justify-center rounded-full gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 ${currentlySelected ? "bg-white" : "bg-sky-700"}`}
          >
            <RyogoCaption color={currentlySelected ? "brand" : "white"}>
              {t("BestValue")}
            </RyogoCaption>
          </div>
        )}
      </SectionRowWrapper>
    </div>
  )
}
