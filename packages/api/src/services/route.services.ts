import { locationRepository } from "../repositories/location.repo"
import { routeRepository } from "../repositories/route.repo"

const MIN_RATIO = 0.8
const MAX_RATIO = 1.2

export const routeServices = {
  async findOrCreateRouteByLocations(
    sourceCity: string,
    sourceState: string,
    destinationCity: string,
    destinationState: string,
  ) {
    if (sourceCity === destinationCity && sourceState === destinationState) {
      return
    }
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
    // Get postgis distance
    const newDistance = await locationRepository.readDistanceBetweenLocations(
      source.id,
      destination.id,
    )
    if (!newDistance || newDistance < 1) {
      return
    }

    //Create new route with this distance
    const newRoute = await routeRepository.createRoute(
      source.id,
      destination.id,
      newDistance,
    )
    return newRoute[0]
  },

  async addNewRouteWithDistance(
    sourceId: string,
    destinationId: string,
    distance: number,
  ) {
    if (sourceId === destinationId) {
      return
    }

    //Check if a route already exists for these locations
    const route = await routeRepository.readRouteByLocations(
      sourceId,
      destinationId,
    )
    if (route) {
      return route
    }

    // Get postgis distance
    const dbDistance = await locationRepository.readDistanceBetweenLocations(
      sourceId,
      destinationId,
    )

    // Check if user entered distance is close to postgis distance
    // If close enough, take user entered distance otherwise take postgis distance
    const ratio = distance / dbDistance
    let newDistance: number
    if (
      !dbDistance ||
      dbDistance < 1 ||
      (ratio > MIN_RATIO && ratio < MAX_RATIO)
    ) {
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
