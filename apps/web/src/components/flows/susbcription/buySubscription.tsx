"use client"

import PaymentButton from "@/components/flows/susbcription/paymentButton"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoH2, RyogoCaption, RyogoP } from "@/components/typography"
import {
  MONTHLY_SUBSCRIPTION_MRP,
  MONTHLY_SUBSCRIPTION_FINAL_PRICE,
  QUARTERLY_SUBSCRIPTION_MRP,
  QUARTERLY_SUBSCRIPTION_FINAL_PRICE,
  ANNUAL_SUBSCRIPTION_MRP,
  ANNUAL_SUBSCRIPTION_FINAL_PRICE,
  ANNUAL_SUBSCRIPTION_DAYS,
  MONTHLY_SUBSCRIPTION_DAYS,
  QUARTERLY_SUBSCRIPTION_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { OrderTypeEnum } from "@ryogo-travel-app/db/schema"
import { ChevronRight, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function BuySubscriptionComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.AccountSubscription.Buy")

  const [selectedPaymentOption, setSelectedOption] = useState<OrderTypeEnum>(
    OrderTypeEnum.MONTHLY,
  )

  return (
    <>
      <div className="w-full rounded-lg bg-slate-900 dark:bg-slate-50 p-7 lg:p-8 gap-4 lg:gap-5 flex flex-col items-center justify-center text-center">
        <RyogoP color="light">{t("ExperiencePremium")}</RyogoP>
        <RyogoH2 color="white" weight="font-bold">
          {t("UpgradeJourney")}
        </RyogoH2>
        <SectionWrapper id="testimonial">
          <RyogoCaption weight="font-bold" color="slate">
            {t("Testimonial")}
          </RyogoCaption>
          <RyogoCaption color="light">{t("TestimonialAuthor")}</RyogoCaption>
        </SectionWrapper>
      </div>
      <SectionWrapper id="getPremium" className="items-center">
        <RyogoCaption color="light">{t("ChooseYourPlan")}</RyogoCaption>
        <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-4 overflow-hidden">
          <PaymentOptionCard
            plan={OrderTypeEnum.MONTHLY}
            mrp={MONTHLY_SUBSCRIPTION_MRP}
            price={MONTHLY_SUBSCRIPTION_FINAL_PRICE}
            days={MONTHLY_SUBSCRIPTION_DAYS}
            selectedOption={selectedPaymentOption}
            onClick={() => setSelectedOption(OrderTypeEnum.MONTHLY)}
          />
          <PaymentOptionCard
            plan={OrderTypeEnum.QUARTERLY}
            mrp={QUARTERLY_SUBSCRIPTION_MRP}
            price={QUARTERLY_SUBSCRIPTION_FINAL_PRICE}
            days={QUARTERLY_SUBSCRIPTION_DAYS}
            selectedOption={selectedPaymentOption}
            onClick={() => setSelectedOption(OrderTypeEnum.QUARTERLY)}
          />
          <PaymentOptionCard
            plan={OrderTypeEnum.ANNUAL}
            mrp={ANNUAL_SUBSCRIPTION_MRP}
            price={ANNUAL_SUBSCRIPTION_FINAL_PRICE}
            selectedOption={selectedPaymentOption}
            days={ANNUAL_SUBSCRIPTION_DAYS}
            onClick={() => setSelectedOption(OrderTypeEnum.ANNUAL)}
          />
        </div>
        <PaymentButton
          agencyId={userDetails.agencyId}
          userId={userDetails.id}
          plan={selectedPaymentOption}
          ownerName={userDetails.name}
          ownerEmail={userDetails.email}
          ownerPhone={userDetails.phone}
          icon={<RyogoIcon icon={ChevronRight} size="sm" color="white" thick />}
          renewLabel={t("PayCTA", {
            plan: selectedPaymentOption,
          })}
        />
        <SectionRowWrapper small className="items-center">
          <RyogoIcon icon={Lock} size="xs" color="light" />
          <RyogoCaption color="light">{t("Secure")}</RyogoCaption>
        </SectionRowWrapper>
      </SectionWrapper>
    </>
  )
}

function getDiscountValue(mrp: number, price: number) {
  return (((mrp - price) * 100) / mrp).toFixed(0)
}

function PaymentOptionCard({
  plan,
  mrp,
  price,
  days,
  selectedOption,
  onClick,
}: {
  plan: OrderTypeEnum
  mrp: number
  price: number
  days: number
  selectedOption: OrderTypeEnum
  onClick: () => void
}) {
  const t = useTranslations("Dashboard.AccountSubscription.Buy")
  const discount = getDiscountValue(mrp, price)
  const currentlySelected = selectedOption === plan
  return (
    <div
      className={`flex w-full flex-row border p-3 lg:p-4 gap-2 lg:gap-3 rounded-lg justify-between transition ${currentlySelected ? "bg-sky-700 dark:bg-sky-300" : "hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800"}`}
      onClick={onClick}
    >
      <SectionColWrapper className="justify-between">
        <RyogoP
          color={currentlySelected ? "white" : "brand"}
          weight="font-bold"
        >
          {plan}
        </RyogoP>
        {discount !== "0" && (
          <RyogoPill
            label={t("Save", { percentage: discount })}
            bgColor={currentlySelected ? "white" : "light"}
          />
        )}
      </SectionColWrapper>
      <SectionColWrapper className="items-end justify-between">
        <SectionRowWrapper small>
          <RyogoP
            color={currentlySelected ? "white" : "brand"}
            weight="font-bold"
          >
            {"₹"}
          </RyogoP>
          <RyogoH2
            color={currentlySelected ? "white" : "brand"}
            weight="font-bold"
          >
            {price}
          </RyogoH2>
        </SectionRowWrapper>
        {discount !== "0" && (
          <RyogoP
            color={currentlySelected ? "white" : "light"}
            className="line-through"
          >
            {t("MRP", { mrp: mrp })}
          </RyogoP>
        )}
        <RyogoCaption
          color={currentlySelected ? "white" : "light"}
          weight="font-medium"
        >
          {t("ForDays", { days: days })}
        </RyogoCaption>
      </SectionColWrapper>
    </div>
  )
}
