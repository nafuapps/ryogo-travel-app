import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  NewVehicleRequestType,
  OnboardingAddVehicleAPIRequestType,
} from "../types/vehicle.types"
import { bookingRepository } from "../repositories/booking.repo"

export const vehicleServices = {
  //Get all vehicles of an agency
  async findVehiclesByAgency(agencyId: string) {
    const vehicles = await vehicleRepository.readAllVehiclesDataByAgencyId(
      agencyId
    )
    return vehicles
  },

  //Find existing vehicles in agency
  async findExistingVehiclesInAgency(agency: string) {
    const vehicles = await vehicleRepository.readAllVehiclesInAgency(agency)
    return vehicles
  },

  //Get onTrip vehicles data
  async findVehiclesOnTrip(agencyId: string) {
    const vehicles = await vehicleRepository.readOnTripVehiclesDataByAgencyId(
      agencyId
    )
    return vehicles
  },

  //Get vehicles schedule
  async findVehiclesScheduleNextDays(agencyId: string, days: number = 7) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const vehiclesScheduleData =
      await vehicleRepository.readVehiclesScheduleData(
        agencyId,
        startDate,
        endDate
      )

    return vehiclesScheduleData
  },

  //Get vehicle details
  async findVehicleDetailsById(id: string) {
    const vehicle = await vehicleRepository.readVehicleById(id)
    if (!vehicle) {
      throw new Error("Vehicle not found")
    }
    return vehicle
  },

  //Get vehicle's assigned bookings
  async findVehicleAssignedBookingsById(id: string, days: number = 1) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const bookings = await bookingRepository.readAssignedBookingsByVehicleId(
      id,
      startDate,
      endDate
    )

    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
      }
    })
  },

  //Get vehicle's completed bookings
  async findVehicleCompletedBookingsById(id: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    )
    //Day today
    const endDate = new Date()
    const bookings = await bookingRepository.readCompletedBookingsByVehicleId(
      id,
      startDate,
      endDate
    )

    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.updatedAt,
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        createdAt: booking.tripLogs[0]?.createdAt,
      }
    })
  },

  //Get all vehicle repairs by vehicleId
  async findAllVehicleRepairsByVehicleId(id: string) {
    const repairs = await vehicleRepairRepository.readVehicleRepairsByVehicleId(
      id
    )
    return repairs
  },

  //Get vehicle repair by id
  async findVehicleRepairById(id: string) {
    return await vehicleRepairRepository.readRepairById(id)
  },

  //Add vehicle to agency
  async addVehicle({ data, agencyId }: OnboardingAddVehicleAPIRequestType) {
    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.readVehicleByNumberInAgency(
        data.vehicleNumber,
        agencyId
      )
    if (existingVehicleInAgency.length > 0) {
      throw new Error(
        "Vehicle with same vehicle number already exists in this agency"
      )
    }
    //Step2: Prepare vehicle data
    const vehicleType = Object.values(VehicleTypesEnum).find(
      (x) => x.toString() === data.type.toLowerCase()
    )

    const newVehicleData = {
      agencyId: agencyId,
      vehicleNumber: data.vehicleNumber,
      type: vehicleType,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity,
      odometerReading: data.odometerReading,
      insuranceExpiresOn: new Date(data.insuranceExpiresOn),
      pucExpiresOn: new Date(data.pucExpiresOn),
      hasAC: data.hasAC,
      defaultRatePerKm: data.defaultRatePerKm,
      defaultAcChargePerDay: data.defaultAcChargePerDay,
    }
    //Step3: Create vehicle in DB
    const newVehicle = await vehicleRepository.createVehicle(newVehicleData)
    if (!newVehicle || newVehicle.length < 1) {
      throw new Error("Vehicle not created")
    }
    //Step4: Return added vehicle
    return newVehicle[0]
  },

  //New vehicle (dashboard)
  async addNewVehicle(data: NewVehicleRequestType) {
    const vehicle = await this.addVehicle(data)
    if (!vehicle) {
      throw new Error("Vehicle not added")
    }
    return vehicle
  },

  //Update Vehicle doc URL
  async renewVehicleDocURLs(
    vehicleId: string,
    rcUrl?: string,
    pucUrl?: string,
    insuranceURL?: string,
    vehiclePhotoUrl?: string
  ) {
    const updatedVehicle = await vehicleRepository.updateDocUrls(
      vehicleId,
      rcUrl,
      pucUrl,
      insuranceURL,
      vehiclePhotoUrl
    )
    if (!updatedVehicle) {
      throw new Error("Failed to update document url for this vehicle in DB")
    }
    return updatedVehicle[0]
  },

  //Update RC URL
  async renewRcURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateRCUrl(vehicleId, url)
    if (!updatedVehicle) {
      throw new Error("Failed to update rc url for this vehicle in DB")
    }
    return updatedVehicle[0]
  },

  //Update PUC URL
  async renewPucURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updatePUCUrl(vehicleId, url)
    if (!updatedVehicle) {
      throw new Error("Failed to update puc url for this vehicle in DB")
    }
    return updatedVehicle[0]
  },

  //Update Insurance URL
  async renewInsuranceURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateInsuranceUrl(
      vehicleId,
      url
    )
    if (!updatedVehicle) {
      throw new Error("Failed to update insurance url for this vehicle in DB")
    }
    return updatedVehicle[0]
  },

  //Update Vehicle photo URL
  async renewVehiclePhotoURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateVehiclePhotoUrl(
      vehicleId,
      url
    )
    if (!updatedVehicle) {
      throw new Error(
        "Failed to update vehicle photo url for this vehicle in DB"
      )
    }
    return updatedVehicle[0]
  },
}

export type FindVehiclesByAgencyType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesByAgency>
>

export type FindVehiclesOnTripType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesOnTrip>
>

export type FindVehiclesScheduleNextDaysType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesScheduleNextDays>
>

export type FindVehicleDetailsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleDetailsById>
>

export type FindAllVehicleRepairsByVehicleIdType = Awaited<
  ReturnType<typeof vehicleServices.findAllVehicleRepairsByVehicleId>
>

export type FindVehicleRepairByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleRepairById>
>

export type FindVehicleAssignedBookingsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleAssignedBookingsById>
>
export type FindVehicleCompletedBookingsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleCompletedBookingsById>
>
