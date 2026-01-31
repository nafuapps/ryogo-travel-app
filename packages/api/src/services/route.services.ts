import { locationRepository } from "../repositories/location.repo"
import { routeRepository } from "../repositories/route.repo"

export const routeServices = {
  async findOrCreateRouteByLocations(
    sourceCity: string,
    sourceState: string,
    destinationCity: string,
    destinationState: string,
  ) {
    const source = await locationRepository.readLocationByCityState(
      sourceCity,
      sourceState,
    )
    const destination = await locationRepository.readLocationByCityState(
      destinationCity,
      destinationState,
    )

    if (!source || !destination) {
      return
    }

    const route = await routeRepository.readRouteByLocations(
      source.id,
      destination.id,
    )
    if (route) {
      return route
    }
    //No route found, create a new one
    const newRoute = await this.addNewRoute(source.id, destination.id)
    return newRoute
  },

  async addNewRoute(sourceId: string, destinationId: string) {
    if (sourceId == destinationId) {
      return
    }

    // Get postgis distance
    const newDistance = await locationRepository.readDistanceBetweenLocations(
      sourceId,
      destinationId,
    )
    if (!newDistance || newDistance < 1) {
      return
    }

    //Create new route with this distance
    const newRoute = await routeRepository.createRoute(
      sourceId,
      destinationId,
      newDistance,
    )
    return newRoute[0]
  },

  async addNewRouteWithDistance(
    sourceId: string,
    destinationId: string,
    distance: number,
  ) {
    if (sourceId == destinationId) {
      return
    }

    // Get postgis distance
    const dbDistance = await locationRepository.readDistanceBetweenLocations(
      sourceId,
      destinationId,
    )

    const ratio = distance / dbDistance
    let newDistance: number
    // Check if entered distance is close to db distance
    // If close enough, use entered distance otherwise use db (postgis) distance
    if (!dbDistance || dbDistance < 1 || (ratio > 0.8 && ratio < 1.2)) {
      newDistance = distance
    } else {
      newDistance = dbDistance
    }
    const newRoute = await routeRepository.createRoute(
      sourceId,
      destinationId,
      newDistance,
    )
    return newRoute[0]
  },
}

export type FindOrCreateRouteByLocationsType = Awaited<
  ReturnType<typeof routeServices.findOrCreateRouteByLocations>
>
