import { Font, StyleSheet } from "@react-pdf/renderer"
import { HOST_URL } from "@ryogo-travel-app/api/apiConfig"

const fontSource = (fileName: string) => {
  if (
    process.env.NODE_ENV !== "production" ||
    typeof process === "undefined" ||
    (process.env.NEXT_RUNTIME !== "nodejs" && process.release?.name !== "node")
  ) {
    return `/fonts/${fileName}`
  }
  return `${HOST_URL}/fonts/${fileName}`
}

const sourceRegular = fontSource("NotoSans-Regular.ttf")
const sourceMedium = fontSource("NotoSans-Medium.ttf")
const sourceBold = fontSource("NotoSans-Bold.ttf")

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: sourceRegular, fontWeight: "normal" },
    { src: sourceMedium, fontWeight: "medium" },
    { src: sourceBold, fontWeight: "bold" },
  ],
})
export const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans",
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: 20,
    padding: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  headerLeft: { flexDirection: "column", gap: 4 },
  agencyLogo: {
    height: 64,
    width: 64,
    objectFit: "contain",
  },
  headerRight: {
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  borderContent: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "8px 12px",
  },
  bookingDetails: { flexDirection: "column", gap: 8 },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  tripDetails: {
    flexDirection: "column",
  },
  tripLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    gap: 16,
  },
  tripSource: {
    gap: 2,
  },
  tripDestination: {
    gap: 2,
    alignItems: "flex-end",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    backgroundColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  pricingTable: {
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    gap: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    gap: 8,
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    gap: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#ddd",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  qrCode: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  qrCodeImage: {
    height: 48,
    aspectRatio: 1,
  },
  booked: {
    flexDirection: "column",
    marginLeft: "auto",
    alignItems: "flex-end",
    gap: 4,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
  },
  bottom: {
    flexDirection: "column",
    gap: 16,
  },
  terms: {
    flexDirection: "column",
    gap: 2,
  },
  powered: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  ryoGoLogo: {
    height: 32,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  p: {
    fontSize: 12,
  },
  pBold: {
    fontSize: 12,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 10,
  },
  captionLight: {
    fontSize: 10,
    color: "#666",
  },
  xs: {
    fontSize: 8,
    color: "#666",
  },
})
