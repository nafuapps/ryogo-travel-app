import { Font, StyleSheet } from "@react-pdf/renderer"

const sourceRegular = "/fonts/NotoSans-Regular.ttf"
const sourceMedium = "/fonts/NotoSans-Medium.ttf"
const sourceBold = "/fonts/NotoSans-Bold.ttf"

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: sourceRegular, fontWeight: 400 },
    { src: sourceMedium, fontWeight: 500 },
    { src: sourceBold, fontWeight: 700 },
  ],
})
export const styles = StyleSheet.create({
  page: {
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
    fontFamily: "Noto Sans",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
  p: {
    fontSize: 12,
    fontFamily: "Noto Sans",
  },
  pBold: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
  caption: {
    fontSize: 10,
    fontFamily: "Noto Sans",
  },
  captionLight: {
    fontSize: 10,
    color: "#666",
    fontFamily: "Noto Sans",
  },
  xs: {
    fontSize: 8,
    color: "#666",
    fontFamily: "Noto Sans",
  },
})
