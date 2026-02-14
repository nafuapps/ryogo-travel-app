"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateAgencyLogoPathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyAgencyAction(data: ModifyAgencyRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  const agency = await agencyServices.modifyAgency(
    data.agencyId,
    data.businessName,
    data.businessAddress,
    data.defaultCommissionRate,
    data.agencyState,
    data.agencyCity,
  )
  if (!agency) return

  if (data.logo && data.logo[0]) {
    const logo = data.logo[0]
    const uploadedFile = await uploadFile(
      logo,
      generateAgencyLogoPathName(data.agencyId, logo),
    )
    await agencyServices.updateAgencyLogo(data.agencyId, uploadedFile.path)
  }

  return agency
}
