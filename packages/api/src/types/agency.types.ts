export type ModifyAgencyRequestType = {
  agencyId: string
  businessName?: string
  businessAddress?: string
  defaultCommissionRate?: number
  agencyState?: string
  agencyCity?: string
  locationId?: string
}

export type ROIReportType = {
  vehicles: number
  leads: number
  bookings: number
  timeSpent: number
  monthlyWage: string
  monthlyCost: string
  bookingLeakage: string
  cityTier: string
  monthlyTimeSavedHours: string
  totalTimeSavings: string
  totalSavingsVehicleCost: string
  totalSavingsBookingLeakages: string
  totalMoneySavings: string
  totalSavings: string
  roiDays: number
}
