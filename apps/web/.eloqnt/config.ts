import { defineConfig } from "@eloqnt/cli"

export default defineConfig({
  srcPath: "./src",
  messages: {
    path: "./src/i18n/locales",
    locales: ["English"],
    sourceLocale: "English",
    format: "json",
  },
})
