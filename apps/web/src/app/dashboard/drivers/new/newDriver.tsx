import { pageClassName } from "@/components/page/pageCommons"
import NewDriverForm from "./newDriverForm"
import { getCurrentUser } from "@/lib/auth"

export default async function NewDriverPageComponent() {
  const currentUser = await getCurrentUser()

  //TODO: Only allow subscribed agencies to add more than 2 drivers

  return (
    <div id="NewDriverPage" className={pageClassName}>
      <NewDriverForm agencyId={currentUser!.agencyId} />
    </div>
  )
}
