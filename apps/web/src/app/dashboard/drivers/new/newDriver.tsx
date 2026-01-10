import { pageClassName } from "@/components/page/pageCommons"
import NewDriverForm from "./newDriverForm"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function NewDriverPageComponent() {
  const currentUser = await getCurrentUser()

  //TODO: Only allow subscribed agencies to add more than 2 drivers

  const allDrivers = await userServices.findAllUsersByRole(UserRolesEnum.DRIVER)

  return (
    <div id="NewDriverPage" className={pageClassName}>
      <NewDriverForm agencyId={currentUser!.agencyId} allDrivers={allDrivers} />
    </div>
  )
}
