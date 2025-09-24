import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema";
import { agencyRepository } from "../repositories/agency.repo";
import { uploadFile } from "@ryogo-travel-app/db/storage";
import { locationRepository } from "../repositories/location.repo";

export type CreateAgencyType = {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessLogo?: FileList | undefined;
  commissionRate?: number;
  agencyState: string;
  agencyCity: string;
};

export const agencyServices = {
  //Get active agencies (admin)
  async getActiveAgencies() {
    return await agencyRepository.getAgenciesByStatus(AgencyStatusEnum.ACTIVE);
  },

  //Create agency
  async createAgency(data: CreateAgencyType) {
    //Step1: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.getAgencyByPhoneEmail(
      data.businessPhone,
      data.businessEmail
    );
    if (existingAgencies.length > 1) {
      // !This is a major issue
      throw new Error(
        "Multiple agencies with same phone and email already exists"
      );
    }
    if (existingAgencies.length > 0) {
      throw new Error("An agency with same phone and email already exists");
    }

    //Step2: Get location id from city, state
    const location = await locationRepository.getLocationByCityState(
      data.agencyCity,
      data.agencyState
    );
    if (!location) {
      throw new Error("Location not found");
    }
    if (location.length > 1) {
      // !This is a major issue
      throw new Error("Multiple locations found");
    }

    //Step3: Prepare agency data (Trial, 30 day expiry, New)
    const createAgencyData = {
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      locationId: location[0]!.id,
      subscriptionExpiresOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      defaultCommissionRate: data.commissionRate,
    };

    //Step4: create a new agency
    const newAgency = await agencyRepository.createAgency(createAgencyData);
    if (newAgency.length < 1) {
      throw new Error("Failed to create new agency");
    }

    //Step5: Upload agency logo on Storage and update logo url in agency
    if (data.businessLogo) {
      agencyServices.updateAgencyLogo(newAgency[0]!.id, data.businessLogo);
    }
    return newAgency[0];
  },

  //Activate an agency
  async activateAgency(id: string) {
    return await agencyRepository.updateAgencyStatus(
      id,
      AgencyStatusEnum.ACTIVE
    );
  },

  async updateAgencyLogo(agencyId: string, logoFile: FileList) {
    const getAgency = await agencyRepository.getAgencyById(agencyId);
    if (!getAgency) {
      throw new Error("Agency not found");
    }
    // Upload logo on SB storage
    const filePath = `${agencyId}/logo}`;
    const uploadResult = await uploadFile(logoFile[0]!, filePath);
    const updatedAgency = await agencyRepository.updateAgencyLogoUrl(
      agencyId,
      uploadResult.fullPath
    );
    if (!updatedAgency) {
      throw new Error("Failed to update logo url for this agency");
    }
    return updatedAgency[0];
  },

  //Increase subscription of an agency by N days
  async increaseSubscriptionExpiry(id: string, days: number) {
    const expiryTime = new Date(
      new Date().getTime() + days * 24 * 60 * 60 * 1000
    );
    return await agencyRepository.updateAgencySubscriptionExpiry(
      id,
      expiryTime
    );
  },
};
