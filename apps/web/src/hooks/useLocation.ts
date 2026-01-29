import { useState, useEffect } from "react"

export function useLocation() {
  const [location, setLocation] = useState({
    latitude: null as null | number,
    longitude: null as null | number,
    error: null as string | null,
  })

  useEffect(() => {
    // Check if the Geolocation API is supported by the browser
    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }))
      return
    }

    // Success callback function
    const successHandler = (position: { coords: GeolocationCoordinates }) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      })
    }

    // Error callback function
    const errorHandler = (err: { code: any; message: any }) => {
      console.warn(`ERROR(${err.code}): ${err.message}`)
      setLocation((prev) => ({ ...prev, error: err.message }))
    }

    // Optional options for high accuracy and timeout
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

    // Request the current position
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options,
    )
  }, []) // Empty dependency array ensures this runs once after mounting

  return location
}
