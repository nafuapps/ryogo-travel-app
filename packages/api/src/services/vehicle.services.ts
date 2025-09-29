import { vehicleRepository } from "../repositories/vehicle.repo";
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";
import { OnboardingAddVehicleAPIRequestType } from "../types/vehicle.types";

export const vehicleServices = {
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
    );
    if (!updatedVehicle) {
      throw new Error("Failed to update rc url for this vehicle in DB");
    }
    return updatedVehicle[0];
  },

  //Update RC URL
  async renewRcURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateRCUrl(vehicleId, url);
    if (!updatedVehicle) {
      throw new Error("Failed to update rc url for this vehicle in DB");
    }
    return updatedVehicle[0];
  },

  //Update PUC URL
  async renewPucURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updatePUCUrl(vehicleId, url);
    if (!updatedVehicle) {
      throw new Error("Failed to update puc url for this vehicle in DB");
    }
    return updatedVehicle[0];
  },

  //Update Insurance URL
  async renewInsuranceURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateInsuranceUrl(
      vehicleId,
      url
    );
    if (!updatedVehicle) {
      throw new Error("Failed to update insurance url for this vehicle in DB");
    }
    return updatedVehicle[0];
  },

  //Update Vehicle photo URL
  async renewVehiclePhotoURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateVehiclePhotoUrl(
      vehicleId,
      url
    );
    if (!updatedVehicle) {
      throw new Error(
        "Failed to update vehicle photo url for this vehicle in DB"
      );
    }
    return updatedVehicle[0];
  },
};
