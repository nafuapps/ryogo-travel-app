import { db } from "@ryogo-travel-app/db"
import { driverLeaves } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const driverLeaveRepository = {
  //Read all driver leaves by driver id
  async readDriverLeavesByDriverId(driverId: string) {
    return await db.query.driverLeaves.findMany({
      where: eq(driverLeaves.driverId, driverId),
    })
  },
  //Ready a leave by id
  async readLeaveById(id: string) {
    return await db.query.driverLeaves.findFirst({
      where: eq(driverLeaves.id, id),
    })
  },
}
