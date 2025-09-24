import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";
import { driverRepository } from "../repositories/driver.repo";
import { uploadFile } from "@ryogo-travel-app/db/storage";

type CreateDriverType = {
  agencyId: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiresOn: Date;
  licensePhotos: FileList;
  canDriveVehicleTypes: string[];
  defaultAllowancePerDay?: number;
};

export const driverServices = {
  //Create driver
  async addDriver(data: CreateDriverType) {
    //Step1: Check if a driver (phone) already exists in this agency
    const existingDriverInAgency =
      await driverRepository.getDriverByPhoneInAgency(
        data.agencyId,
        data.phone
      );
    if (existingDriverInAgency.length > 0) {
      throw new Error(
        "Driver with same phone number already exists in this agency"
      );
    }

    //Step2: Check if driver (userId) already exists in the system
    const existingDriverUser = await driverRepository.getDriverByUserId(
      data.userId
    );
    if (existingDriverUser.length > 0) {
      throw new Error("Driver with same userId already exists ");
    }

    const canDrive = Object.values(VehicleTypesEnum).filter((x) =>
      data.canDriveVehicleTypes.includes(x as string)
    );
    //Step3: Prepare driver data
    const newDriverData = {
      agencyId: data.agencyId,
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      canDriveVehicleTypes: canDrive,
    };
    const newDriver = await driverRepository.createDriver(newDriverData);
    if (newDriver.length < 1) {
      throw new Error("Failed to create driver");
    }

    //Step4: Upload license photo in storage and update driver
    await driverServices.updateDriverLicensePhoto(
      newDriver[0]!.id,
      data.licensePhotos
    );
    return newDriver[0];
  },

  //Upload driver license photo
  async updateDriverLicensePhoto(driverId: string, licensePhoto: FileList) {
    const getDriver = await driverRepository.getDriverById(driverId);
    if (!getDriver) {
      throw new Error("Driver not found");
    }
    // Upload license photo on SB storage
    const filePath = `${driverId}/license}`;
    const uploadResult = await uploadFile(licensePhoto[0]!, filePath);
    const updatedDriver = await driverRepository.updateDriverLicenseUrl(
      driverId,
      uploadResult.fullPath
    );
    if (!updatedDriver) {
      throw new Error("Failed to update license url for this driver");
    }
    return updatedDriver[0];
  },
};
