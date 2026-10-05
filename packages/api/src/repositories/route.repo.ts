import { db } from "@ryogo-travel-app/db"
import { InsertRouteType, routes } from "@ryogo-travel-app/db/schema"
import { and, eq } from "drizzle-orm"

export const routeRepository = {
  async readRouteByLocations({
    sourceId,
    destinationId,
  }: {
    sourceId: string
    destinationId: string
  }) {
    return await db.query.routes.findFirst({
      where: and(
        eq(routes.sourceId, sourceId),
        eq(routes.destinationId, destinationId),
      ),
    })
  },

  async createRoute(data: InsertRouteType) {
    return await db.insert(routes).values(data).returning()
  },
}
