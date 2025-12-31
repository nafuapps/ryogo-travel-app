import { db } from "@ryogo-travel-app/db"
import { routes } from "@ryogo-travel-app/db/schema"
import { and, eq } from "drizzle-orm"

export const routeRepository = {
  async readRouteByLocations(sourceId: string, destinationId: string) {
    return await db.query.routes.findFirst({
      where: and(
        eq(routes.sourceId, sourceId),
        eq(routes.destinationId, destinationId)
      ),
    })
  },

  async createRoute(
    sourceId: string,
    destinationId: string,
    distance: number,
    time?: number
  ) {
    return await db
      .insert(routes)
      .values({
        sourceId,
        destinationId,
        distance: distance,
        estimatedTime: time ?? distance,
        isActive: true,
      })
      .returning()
  },
}
