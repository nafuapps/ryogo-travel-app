"use client"

import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import ROIReportPDFDownloadButton from "@/components/pdf/roiReportPDFDownloadButton"
import {
  RyogoCaption,
  RyogoH1,
  RyogoH4,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { formatIndianCurrency } from "@/lib/utils"
import {
  MONTHLY_SUBSCRIPTION_DAYS,
  MONTHLY_SUBSCRIPTION_FINAL_PRICE,
} from "@ryogo-travel-app/api/apiConfig"
import { ROIReportType } from "@ryogo-travel-app/api/types/agency.types"
import { HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

const VEHICLE_MIN = 1
const VEHICLE_MAX = 10
const VEHICLE_STEP = 1
const VEHICLE_DEFAULT = 3

const LEADS_MIN = 10
const LEADS_MAX = 200
const LEADS_STEP = 10
const LEADS_DEFAULT = 90 //Daily average 3 leads

const BOOKINGS_MIN = 5
const BOOKINGS_MAX = 50
const BOOKINGS_STEP = 5
const BOOKINGS_DEFAULT = 20 //Monthly average bookings

const TIME_SPENT_MIN = 10
const TIME_SPENT_MAX = 45
const TIME_SPENT_STEP = 5
const TIME_SPENT_DEFAULT = 25 //Daily average 25 minute spent per booking/lead

const MONTHLY_WAGE_MIN = 8000
const MONTHLY_WAGE_MAX = 20000
const MONTHLY_WAGE_STEP = 1000
const MONTHLY_WAGE_DEFAULT = 12000

const WORK_HOURS_MONTH = 250 // 10 hours/day * 25 days
const BOOKING_TIME_RYOGO = 10 //10 minutes per booking in RyoGo (for taking difference)

const MONTHLY_COST_MIN = 0
const MONTHLY_COST_MAX = 5000
const MONTHLY_COST_STEP = 500
const MONTHLY_COST_DEFAULT = 1000

const BOOKING_LEAKAGE_MIN = 0
const BOOKING_LEAKAGE_MAX = 1000
const BOOKING_LEAKAGE_STEP = 100
const BOOKING_LEAKAGE_DEFAULT = 300

const CITY_TIERS = ["Tier 1", "Tier 2", "Tier 3"]
const CITY_DEFAULT = "Tier 2"

export default function ROICard() {
  const t = useTranslations("Landing.Pricing.ROI")

  const [vehicles, setVehicles] = useState([VEHICLE_DEFAULT])
  const [leads, setLeads] = useState([LEADS_DEFAULT])
  const [bookings, setBookings] = useState([BOOKINGS_DEFAULT])

  const [timeSpent, setTimeSpent] = useState([TIME_SPENT_DEFAULT])
  const [monthlyWage, setMonthlyWage] = useState([MONTHLY_WAGE_DEFAULT])
  const [monthlyCost, setMonthlyCost] = useState([MONTHLY_COST_DEFAULT])
  const [bookingLeakage, setBookingLeakage] = useState([
    BOOKING_LEAKAGE_DEFAULT,
  ])

  const [cityTier, setCityTier] = useState(CITY_DEFAULT)

  const resetAllValues = () => {
    setVehicles([VEHICLE_DEFAULT])
    setLeads([LEADS_DEFAULT])
    setBookings([BOOKINGS_DEFAULT])
    setTimeSpent([TIME_SPENT_DEFAULT])
    setMonthlyWage([MONTHLY_WAGE_DEFAULT])
    setMonthlyCost([MONTHLY_COST_DEFAULT])
    setBookingLeakage([BOOKING_LEAKAGE_DEFAULT])
    setCityTier(CITY_DEFAULT)
  }

  const cityAdjustment = getCityAdjustment(cityTier)

  const { monthlyTimeSavedHours, monthlyTimeSavings } = useMemo(
    () =>
      getTimeSavings({
        timeSpentPerBooking: timeSpent[0] ?? TIME_SPENT_DEFAULT,
        bookingsPerMonth: bookings[0] ?? BOOKINGS_DEFAULT,
        leadsPerMonth: leads[0] ?? LEADS_DEFAULT,
        monthlyWagePerAgent: monthlyWage[0] ?? MONTHLY_WAGE_DEFAULT,
      }),
    [timeSpent, bookings, monthlyWage, leads],
  )

  const totalTimeSavings = monthlyTimeSavings * cityAdjustment

  const { savingsVehicleCost, savingsBookingLeakages } = useMemo(
    () =>
      getCostSavings({
        monthlyCostPerVehicle: monthlyCost[0] ?? MONTHLY_COST_DEFAULT,
        vehicles: vehicles[0] ?? VEHICLE_DEFAULT,
        bookingsPerMonth: bookings[0] ?? BOOKINGS_DEFAULT,
        leakagePerBooking: bookingLeakage[0] ?? BOOKING_LEAKAGE_DEFAULT,
      }),
    [monthlyCost, bookingLeakage, vehicles, bookings],
  )

  const totalSavingsVehicleCost = savingsVehicleCost * cityAdjustment
  const totalSavingsBookingLeakages = savingsBookingLeakages * cityAdjustment

  const totalMoneySavings =
    totalSavingsVehicleCost + totalSavingsBookingLeakages

  const totalSavings = totalTimeSavings + totalMoneySavings

  const roiDays =
    1 +
    (MONTHLY_SUBSCRIPTION_FINAL_PRICE * MONTHLY_SUBSCRIPTION_DAYS) /
      totalSavings

  const report: ROIReportType = {
    vehicles: vehicles[0] ?? VEHICLE_DEFAULT,
    leads: leads[0] ?? LEADS_DEFAULT,
    bookings: bookings[0] ?? BOOKINGS_DEFAULT,
    timeSpent: timeSpent[0] ?? TIME_SPENT_DEFAULT,
    monthlyWage: formatIndianCurrency(monthlyWage[0] ?? MONTHLY_WAGE_DEFAULT),
    monthlyCost: formatIndianCurrency(monthlyCost[0] ?? MONTHLY_COST_DEFAULT),
    bookingLeakage: formatIndianCurrency(
      bookingLeakage[0] ?? BOOKING_LEAKAGE_DEFAULT,
    ),
    cityTier: cityTier,
    monthlyTimeSavedHours: monthlyTimeSavedHours.toFixed(0),
    totalTimeSavings: formatIndianCurrency(totalTimeSavings),
    totalSavingsVehicleCost: formatIndianCurrency(totalSavingsVehicleCost),
    totalSavingsBookingLeakages: formatIndianCurrency(
      totalSavingsBookingLeakages,
    ),
    totalMoneySavings: formatIndianCurrency(totalMoneySavings),
    totalSavings: formatIndianCurrency(totalSavings),
    roiDays: roiDays,
  }

  return (
    <ScrollZoomIn className="flex flex-col md:flex-row shadow w-full rounded-lg overflow-hidden">
      <div
        id="input"
        className="flex flex-col gap-5 md:gap-6 bg-white dark:bg-slate-800 p-6 md:p-8 w-full"
      >
        <ROISlider
          label={t("Input.Vehicles")}
          min={VEHICLE_MIN}
          max={VEHICLE_MAX}
          step={VEHICLE_STEP}
          value={vehicles}
          setValue={setVehicles}
        />
        <ROISlider
          label={t("Input.Bookings")}
          min={BOOKINGS_MIN}
          max={BOOKINGS_MAX}
          step={BOOKINGS_STEP}
          value={bookings}
          setValue={setBookings}
        />
        <ROISlider
          label={t("Input.Leads")}
          min={LEADS_MIN}
          max={LEADS_MAX}
          step={LEADS_STEP}
          value={leads}
          setValue={setLeads}
        />
        <ROISlider
          label={t("Input.TimeSpent")}
          min={TIME_SPENT_MIN}
          max={TIME_SPENT_MAX}
          step={TIME_SPENT_STEP}
          value={timeSpent}
          setValue={setTimeSpent}
        />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <RyogoSmall color="light">{t("Input.Advanced")}</RyogoSmall>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col w-full gap-4 lg:gap-5">
              <ROISlider
                label={t("Input.MonthlyWage")}
                min={MONTHLY_WAGE_MIN}
                max={MONTHLY_WAGE_MAX}
                step={MONTHLY_WAGE_STEP}
                value={monthlyWage}
                setValue={setMonthlyWage}
              />
              <ROISlider
                label={t("Input.MonthlyCost")}
                min={MONTHLY_COST_MIN}
                max={MONTHLY_COST_MAX}
                step={MONTHLY_COST_STEP}
                value={monthlyCost}
                setValue={setMonthlyCost}
              />
              <ROISlider
                label={t("Input.BookingLeakage")}
                min={BOOKING_LEAKAGE_MIN}
                max={BOOKING_LEAKAGE_MAX}
                step={BOOKING_LEAKAGE_STEP}
                value={bookingLeakage}
                setValue={setBookingLeakage}
              />
              <TabSelect
                label={t("Input.City")}
                selected={cityTier}
                setSelected={setCityTier}
                tabs={CITY_TIERS}
              />
              <RyogoOutlineButton
                label={t("Input.Reset")}
                labelColor="light"
                onClick={() => resetAllValues()}
              />
              <HelpDialog />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div
        id="output"
        className="flex flex-col items-center gap-5 md:gap-6 bg-sky-100 dark:bg-sky-900 p-6 md:p-8 w-full"
      >
        <SectionColWrapper small className="items-center">
          <RyogoP color="slate">{t("Output.Total")}</RyogoP>
          <RyogoH1 color="brand" weight="font-bold">
            {formatIndianCurrency(totalSavings)}
          </RyogoH1>
        </SectionColWrapper>
        <div className="w-full lg:w-3/4 flex flex-col rounded-md gap-2 lg:gap-3 bg-white dark:bg-slate-800 p-3 md:p-4">
          <OutputRow
            label={t("Output.TimeSaved.Label")}
            value={t("Output.TimeSaved.Value", {
              value: monthlyTimeSavedHours.toFixed(0),
            })}
          />
          <OutputRow
            label={t("Output.TotalTimeValueSavings")}
            value={formatIndianCurrency(monthlyTimeSavings)}
          />
          <OutputRow
            label={t("Output.CostSavings")}
            value={formatIndianCurrency(totalSavingsVehicleCost)}
          />
          <OutputRow
            label={t("Output.LeakageSavings")}
            value={formatIndianCurrency(totalSavingsBookingLeakages)}
          />
          <OutputRow
            label={t("Output.TotalMoneySavings")}
            value={formatIndianCurrency(totalMoneySavings)}
          />
          {roiDays <= MONTHLY_SUBSCRIPTION_DAYS && (
            <OutputRow
              label={t("Output.Return")}
              value={t("Output.ReturnDays", { days: roiDays.toFixed(0) })}
            />
          )}
        </div>
        {totalSavings > 0 && roiDays <= MONTHLY_SUBSCRIPTION_DAYS && (
          <ROIReportPDFDownloadButton
            label={t("Output.DownloadCTA")}
            report={report}
          />
        )}
      </div>
    </ScrollZoomIn>
  )
}

function getCityAdjustment(cityTier: string) {
  switch (cityTier) {
    case "Tier 1":
      return 1.1
    case "Tier 3":
      return 0.9
    case "Tier 2":
    default:
      return 1
  }
}

function getCostSavings({
  vehicles,
  monthlyCostPerVehicle,
  bookingsPerMonth,
  leakagePerBooking,
}: {
  vehicles: number
  monthlyCostPerVehicle: number
  bookingsPerMonth: number
  leakagePerBooking: number
}) {
  const savingsVehicleCost = vehicles * monthlyCostPerVehicle
  const savingsBookingLeakages = leakagePerBooking * bookingsPerMonth

  return { savingsVehicleCost, savingsBookingLeakages }
}

function getTimeSavings({
  timeSpentPerBooking,
  bookingsPerMonth,
  leadsPerMonth,
  monthlyWagePerAgent,
}: {
  timeSpentPerBooking: number
  bookingsPerMonth: number
  leadsPerMonth: number
  monthlyWagePerAgent: number
}) {
  const monthlyTimeSavedHours =
    ((timeSpentPerBooking - BOOKING_TIME_RYOGO) *
      (leadsPerMonth + bookingsPerMonth)) /
    60
  const costPerMinute = monthlyWagePerAgent / WORK_HOURS_MONTH
  const monthlyTimeSavings = monthlyTimeSavedHours * costPerMinute
  return { monthlyTimeSavedHours, monthlyTimeSavings }
}

function ROISlider({
  label,
  min,
  max,
  step,
  value,
  setValue,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number[]
  setValue: (value: number[]) => void
}) {
  return (
    <SectionColWrapper className="w-full">
      <SectionRowWrapper className="items-center justify-between">
        <RyogoCaption color="slate" weight="font-normal">
          {label}
        </RyogoCaption>
        <RyogoSmall color="slate" weight="font-bold">
          {value}
        </RyogoSmall>
      </SectionRowWrapper>
      <Slider
        id={label}
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
      />
    </SectionColWrapper>
  )
}

function TabSelect({
  label,
  selected,
  tabs,
  setSelected,
}: {
  label: string
  selected: string
  tabs: string[]
  setSelected: (tab: string) => void
}) {
  return (
    <SectionColWrapper>
      <RyogoCaption color="light" weight="font-bold">
        {label}
      </RyogoCaption>
      <div className="flex items-center w-full rounded-lg border bg-white dark:bg-slate-800 gap-1.5 lg:gap-2 p-1 lg:p-1.5 self-center">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setSelected(tab)}
            className={`flex w-full items-center rounded transition justify-center p-1.5 lg:p-2 ${
              selected === tab
                ? "bg-slate-900 dark:bg-slate-50 shadow"
                : "hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-xs"
            }`}
          >
            <RyogoCaption color={selected === tab ? "white" : "slate"}>
              {tab}
            </RyogoCaption>
          </div>
        ))}
      </div>
    </SectionColWrapper>
  )
}

function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <SectionRowWrapper className="items-center justify-between">
      <RyogoCaption color="slate">{label}</RyogoCaption>
      <RyogoCaption weight="font-bold" color="light">
        {value}
      </RyogoCaption>
    </SectionRowWrapper>
  )
}

function HelpDialog() {
  const t = useTranslations("Landing.Pricing.ROI.Dialog")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <RyogoGhostButton label={t("Help")} labelColor="light">
          <RyogoIcon icon={HelpCircle} size="sm" />
        </RyogoGhostButton>
      </DialogTrigger>
      <DialogContent className="size-5/6 overflow-hidden">
        <DialogHeader>
          <RyogoH4 weight="font-bold">{t("Title")}</RyogoH4>
          <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        </DialogHeader>
        <SectionColWrapper className="overflow-y-scroll no-scrollbar">
          <RyogoP weight="font-bold">{t("Vehicles.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("Vehicles.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("CompletedBookings.Title")}</RyogoP>
          <RyogoSmall color="slate">
            {t("CompletedBookings.Description")}
          </RyogoSmall>
          <RyogoP weight="font-bold">{t("Leads.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("Leads.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("TimeSpent.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("TimeSpent.Description")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSpent.Line1")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSpent.Line2")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSpent.Line3")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSpent.Line4")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSpent.Line5")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("MonthlyWage.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("MonthlyWage.Description")}</RyogoSmall>
          <RyogoSmall color="slate">{t("MonthlyWage.Subtitle")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("MonthlyVehicleCost.Title")}</RyogoP>
          <RyogoSmall color="slate">
            {t("MonthlyVehicleCost.Description")}
          </RyogoSmall>
          <RyogoSmall color="slate">
            {t("MonthlyVehicleCost.Subtitle")}
          </RyogoSmall>
          <RyogoP weight="font-bold">{t("Leakages.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("Leakages.Description")}</RyogoSmall>
          <RyogoSmall color="slate">{t("Leakages.Subtitle")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("City.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("City.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("TimeSaved.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("TimeSaved.Description")}</RyogoSmall>
          <RyogoSmall color="slate">{t("TimeSaved.Subtitle")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("TimeValue.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("TimeValue.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("CostSavings.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("CostSavings.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("LeakageSavings.Title")}</RyogoP>
          <RyogoSmall color="slate">
            {t("LeakageSavings.Description")}
          </RyogoSmall>
          <RyogoP weight="font-bold">{t("TotalSavings.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("TotalSavings.Description")}</RyogoSmall>
          <RyogoP weight="font-bold">{t("Return.Title")}</RyogoP>
          <RyogoSmall color="slate">{t("Return.Description")}</RyogoSmall>
          <RyogoSmall color="slate">{t("Return.Subtitle")}</RyogoSmall>
        </SectionColWrapper>
      </DialogContent>
    </Dialog>
  )
}
