import { pageClassName } from "@/components/page/pageCommons"
import NewVehicleForm from "./newVehicleForm"
import { getCurrentUser } from "@/lib/auth"

export default async function NewVehiclePageComponent() {
  const currentUser = await getCurrentUser()

  //TODO: Only allow subscribed agencies to add more than 2 vehicles

  return (
    <div id="NewVehiclePage" className={pageClassName}>
      <NewVehicleForm agencyId={currentUser!.agencyId} />
    </div>
  )
}
