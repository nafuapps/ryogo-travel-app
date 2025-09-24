import { uploadFile } from "@ryogo-travel-app/db/storage";
import { vehicleRepository } from "../repositories/vehicle.repo";
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";

export type OnboardingAddVehicleType = {
  vehicleNumber: string;
  type: string;
  brand: string;
  color: string;
  model: string;
  capacity?: number | undefined;
  odometerReading: number;
  insuranceExpiresOn?: Date | undefined;
  pucExpiresOn?: Date | undefined;
  hasAC: boolean;
  rcPhotos?: FileList | undefined;
  vehiclePhotos?: FileList | undefined;
  insurancePhotos?: FileList | undefined;
  pucPhotos?: FileList | undefined;
  defaultRatePerKm?: number | undefined;
  extraAcChargePerDay?: number | undefined;
};

export const vehicleServices = {
  //Add vehicle to agency
  async addVehicle(data: OnboardingAddVehicleType, agencyId: string) {
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
      (x) => x === data.type
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
    if (!newVehicle) {
      throw new Error("Vehicle not created");
    }

    //Step4: Upload and update vehicle document
    await vehicleServices.updateVehicleDocument(
      newVehicle[0].id,
      data.rcPhotos,
      data.pucPhotos,
      data.insurancePhotos,
      data.vehiclePhotos
    );
    return newVehicle[0];
  },

  //Upload and update vehicle document by document type
  async updateVehicleDocument(
    vehicleId: string,
    rcPhoto?: FileList | undefined,
    pucPhoto?: FileList | undefined,
    insurancePhoto?: FileList | undefined,
    vehiclePhoto?: FileList | undefined
  ) {
    const getVehicle = await vehicleRepository.getVehicleById(vehicleId);
    if (!getVehicle) {
      throw new Error("Vehicle not found");
    }

    let rcUrl = undefined;
    let insuranceUrl = undefined;
    let pucUrl = undefined;
    let vehiclePhotoUrl = undefined;

    // Upload docs on SB storage
    if (rcPhoto) {
      const filePath = `${vehicleId}/rc`;
      const uploadRC = await uploadFile(rcPhoto[0], filePath);
      rcUrl = uploadRC.fullPath;
    }
    if (pucPhoto) {
      const filePath = `${vehicleId}/puc`;
      const uploadPuc = await uploadFile(pucPhoto[0], filePath);
      pucUrl = uploadPuc.fullPath;
    }
    if (insurancePhoto) {
      const filePath = `${vehicleId}/insurance`;
      const uploadInsurance = await uploadFile(insurancePhoto[0], filePath);
      insuranceUrl = uploadInsurance.fullPath;
    }
    if (vehiclePhoto) {
      const filePath = `${vehicleId}/vehiclePhoto`;
      const uploadVehiclePhoto = await uploadFile(vehiclePhoto[0], filePath);
      vehiclePhotoUrl = uploadVehiclePhoto.fullPath;
    }

    if (!rcUrl && !pucUrl && !insuranceUrl && !vehiclePhotoUrl) {
      throw new Error(
        "Failed to upload any document for this vehicle on storage"
      );
    }

    const updatedVehicle = await vehicleRepository.updateVehicleDocsUrl(
      vehicleId,
      rcUrl,
      pucUrl,
      insuranceUrl,
      vehiclePhotoUrl
    );
    if (!updatedVehicle) {
      throw new Error(
        "Failed to update any document url for this vehicle in DB"
      );
    }
    return updatedVehicle[0];
  },
};
