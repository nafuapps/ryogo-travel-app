import { uploadFile } from "@ryogo-travel-app/db/storage";
import { vehicleRepository } from "../repositories/vehicle.repo";
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";
import { OnboardingAddVehicleAPIRequestType } from "../types/vehicle.types";

export const vehicleServices = {
  //Find vehicle by vehicle number in an agency (Onboarding flow)
  async findVehicleByNumberInAgency(agencyId: string, vehicleNumber: string) {
    return await vehicleRepository.getVehicleByNumberInAgency(
      agencyId,
      vehicleNumber
    );
  },

  //Add vehicle to agency
  async addVehicle({ data, agencyId }: OnboardingAddVehicleAPIRequestType) {
    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.getVehicleByNumberInAgency(
        data.vehicleNumber,
        agencyId
      );
    if (existingVehicleInAgency.length > 0) {
      throw new Error(
        "Vehicle with same vehicle number already exists in this agency"
      );
    }
    //Step2: Prepare vehicle data
    const vehicleType = Object.values(VehicleTypesEnum).find(
      (x) => x.toString() === data.type.toLowerCase()
    );

    const newVehicleData = {
      agencyId: agencyId,
      vehicleNumber: data.vehicleNumber,
      type: vehicleType,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity,
      odometerReading: data.odometerReading,
      insuranceExpiresOn: data.insuranceExpiresOn,
      pucExpiresOn: data.pucExpiresOn,
      hasAC: data.hasAC,
      defaultRatePerKm: data.defaultRatePerKm,
      extraAcChargePerDay: data.extraAcChargePerDay,
    };
    //Step3: Create vehicle in DB
    const newVehicle = await vehicleRepository.createVehicle(newVehicleData);
    if (!newVehicle || newVehicle.length < 1) {
      throw new Error("Vehicle not created");
    }
    //Step4: Return added vehicle
    return newVehicle[0];
  },

  //Upload and update vehicle document by document type
  async updateVehicleDocURLs(
    vehicleId: string,
    rcPhoto: string,
    pucPhoto: string,
    insurancePhoto: string,
    vehiclePhoto: string
  ) {
    const updatedVehicle = await vehicleRepository.updateVehicleDocsUrl(
      vehicleId,
      rcPhoto,
      pucPhoto,
      insurancePhoto,
      vehiclePhoto
    );
    console.log({ updatedVehicle });
    if (!updatedVehicle) {
      throw new Error(
        "Failed to update any document url for this vehicle in DB"
      );
    }
    return updatedVehicle[0];
  },
};
