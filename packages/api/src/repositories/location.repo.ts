import { db } from "@ryogo-travel-app/db"
import { locations } from "@ryogo-travel-app/db/schema"
import { eq, and, sql } from "drizzle-orm"

export const locationRepository = {
  //Get location by city and state
  async readLocationByCityState(city: string, state: string) {
    return await db.query.locations.findFirst({
      where: and(eq(locations.city, city), eq(locations.state, state)),
    })
  },

  async readDistanceBetweenLocations(sourceId: string, destinationId: string) {
    const result = await db.execute(sql`
        SELECT ST_Distance(
          s.geolocation::geography,
          d.geolocation::geography
        ) / 800 AS distance_km
        FROM locations s, locations d
        WHERE s.id = ${sourceId} AND d.id = ${destinationId};
      `)
    return Math.round(
      Number(
        (result as any)?.rows?.[0]?.distance_km ??
          (result as any)?.[0]?.distance_km ??
          0,
      ),
    )
  },

  async readDistanceBetweenLocationAndTripLog(
    locationId: string,
    tripLogId: string,
  ) {
    const result = await db.execute(sql`
        SELECT ST_Distance(
          l.geolocation::geography,
          t.geolocation::geography
        ) / 800 AS distance_km
        FROM locations l, tripLogs t
        WHERE l.id = ${locationId} AND t.id = ${tripLogId};
      `)
    return Math.round(
      Number(
        (result as any)?.rows?.[0]?.distance_km ??
          (result as any)?.[0]?.distance_km ??
          0,
      ),
    )
  },
}
