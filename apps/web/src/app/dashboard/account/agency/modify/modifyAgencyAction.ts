"use server"

import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyAgencyAction(data: ModifyAgencyRequestType) {
  let logoUrl
  if (data.logo && data.logo[0]) {
    const logo = data.logo[0]
    const uploadedFile = await uploadFile(
      logo,
      `${data.agencyId}/logo/${Date.now()}-${logo.name}`,
    )
    logoUrl = uploadedFile?.path
  }
  const agency = await agencyServices.modifyAgency(
    data.agencyId,
    data.businessName,
    data.businessAddress,
    data.defaultCommissionRate,
    data.agencyState,
    data.agencyCity,
    logoUrl,
  )

  return agency
}
