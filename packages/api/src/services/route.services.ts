import { locationRepository } from "../repositories/location.repo";
import { routeRepository } from "../repositories/route.repo";

export const routeServices = {
  async findOrCreateRouteByLocations(
    sourceCity: string,
    sourceState: string,
    destinationCity: string,
    destinationState: string
  ) {
    const source = await locationRepository.getLocationByCityState(
      sourceCity,
      sourceState
    );
    const destination = await locationRepository.getLocationByCityState(
      destinationCity,
      destinationState
    );

    if (!source || !destination) {
      throw new Error("Location not found");
    }

    const route = await routeRepository.getRouteByLocations(
      source.id,
      destination.id
    );
    if (route) {
      return route;
    }
    //No route found, create a new one
    const newRoute = await this.addNewRoute(source.id, destination.id);
    return newRoute;
  },

  async addNewRoute(sourceId: string, destinationId: string) {
    if (sourceId === destinationId) {
      throw new Error("Source and destination cannot be same");
    }

    // Get postgis distance
    const newDistance = await locationRepository.getDistance(
      sourceId,
      destinationId
    );
    if (!newDistance || newDistance < 1) {
      throw new Error("Invalid distance");
    }

    //Create new route with this distance
    const newRoute = await routeRepository.createRoute(
      sourceId,
      destinationId,
      newDistance
    );
    if (!newRoute || newRoute.length < 1) {
      throw new Error("Error creating route");
    }
    return newRoute[0];
  },

  async addNewRouteWithDistance(
    sourceId: string,
    destinationId: string,
    distance: number
  ) {
    if (sourceId === destinationId) {
      throw new Error("Source and destination cannot be same");
    }

    // Get postgis distance
    const dbDistance = await locationRepository.getDistance(
      sourceId,
      destinationId
    );

    const ratio = distance / dbDistance;
    let newDistance: number;
    // Check if entered distance is close to db distance
    // If close enough, use entered distance otherwise use db (postgis) distance
    if (!dbDistance || dbDistance < 1 || (ratio > 0.8 && ratio < 1.2)) {
      newDistance = distance;
    } else {
      newDistance = dbDistance;
    }
    const newRoute = await routeRepository.createRoute(
      sourceId,
      destinationId,
      newDistance
    );
    if (!newRoute || newRoute.length < 1) {
      throw new Error("Error creating route");
    }
    return newRoute[0];
  },
};
