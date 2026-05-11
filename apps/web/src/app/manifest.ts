import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RyoGo Travel App PWA",
    short_name: "RyoGo",
    description: "A Travel Agency Web App",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logoPWA.png",
        sizes: "160x160",
        type: "image/png",
      },
      {
        src: "/logoPWALight.png",
        sizes: "160x160",
        type: "image/png",
      },
    ],
  }
}
