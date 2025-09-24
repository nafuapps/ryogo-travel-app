import { db } from "@ryogo-travel-app/db";
import { locations } from "@ryogo-travel-app/db/schema";
import { eq, and } from "drizzle-orm";

export const locationRepository = {
  //Get location by city and state
  async getLocationByCityState(city: string, state: string) {
    return await db
      .select()
      .from(locations)
      .where(and(eq(locations.city, city), eq(locations.state, state)));
  },
};
