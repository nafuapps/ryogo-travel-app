import {
  DISTANCE_RATIO_CHECK_THRESHOLD,
  MAX_USER_DISTANCE_RATIO,
  MIN_USER_DISTANCE_RATIO,
} from "../apiConfig"
import { locationRepository } from "../repositories/location.repo"
import { routeRepository } from "../repositories/route.repo"

export const routeServices = {
  async findOrCreateRouteByLocations({
    sourceCity,
    sourceState,
    destinationCity,
    destinationState,
  }: {
    sourceCity: string
    sourceState: string
    destinationCity: string
    destinationState: string
  }) {
    if (sourceCity === destinationCity && sourceState === destinationState) {
      console.error(
        `Same source and destination location provided: ${sourceCity},${sourceState}`,
      )
      return
    }
    const source = await locationRepository.readLocationByCityState({
      city: sourceCity,
      state: sourceState,
    })
    if (!source) {
      console.error(`Source not found: ${sourceCity},${sourceState}`)
      return
    }
    const destination = await locationRepository.readLocationByCityState({
      city: destinationCity,
      state: destinationState,
    })

    if (!destination) {
      console.error(
        `Destination not found: ${destinationCity},${destinationState}`,
      )
      return
    }

    const route = await routeRepository.readRouteByLocations({
      sourceId: source.id,
      destinationId: destination.id,
    })
    if (route) {
      return route
    }
    //No route found, create a new one
    // Get postgis distance
    const newDistance = await locationRepository.readDistanceBetweenLocations({
      sourceId: source.id,
      destinationId: destination.id,
    })
    if (!newDistance || newDistance < 1) {
      console.error(
        `Could not get distance or distance < 1 for new route: ${source.id} - ${destination.id}`,
      )
      return
    }

    //Create new route with this distance
    const [newRoute] = await routeRepository.createRoute({
      sourceId: source.id,
      destinationId: destination.id,
      distance: newDistance,
      estimatedTime: newDistance,
    })
    return newRoute
  },

  async addNewRouteWithDistance({
    sourceId,
    destinationId,
    distance,
  }: {
    sourceId: string
    destinationId: string
    distance: number
  }) {
    if (sourceId === destinationId) {
      console.error(
        `Same source and destination Id provided: ${sourceId} ${destinationId}`,
      )
      return
    }

    //Check if a route already exists for these locations
    const route = await routeRepository.readRouteByLocations({
      sourceId,
      destinationId,
    })
    if (route) {
      return route
    }

    // Get postgis distance
    const dbDistance = await locationRepository.readDistanceBetweenLocations({
      sourceId,
      destinationId,
    })

    let newDistance: number

    if (!dbDistance || dbDistance < DISTANCE_RATIO_CHECK_THRESHOLD) {
      //If distance not found in db or is less than check threshold, just accept user distance
      newDistance = distance
    } else {
      // Check if user entered distance is close to postgis distance
      // If close enough, take user entered distance otherwise take postgis distance
      const ratio = distance / dbDistance
      if (ratio > MIN_USER_DISTANCE_RATIO && ratio < MAX_USER_DISTANCE_RATIO) {
        newDistance = distance
      } else {
        newDistance = dbDistance
      }
    }

    const [newRoute] = await routeRepository.createRoute({
      sourceId,
      destinationId,
      distance: newDistance,
      estimatedTime: newDistance,
    })
    return newRoute
  },
}

export type FindOrCreateRouteByLocationsType = Awaited<
  ReturnType<typeof routeServices.findOrCreateRouteByLocations>
>
