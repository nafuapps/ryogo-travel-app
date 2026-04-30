import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: 20,
    padding: 32,
  },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#ddd",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-end",
  },
  powered: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  ryoGoLogo: {
    height: 32,
  },
  booked: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
  },
  terms: {
    flexDirection: "column",
    gap: 2,
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
    fontWeight: "light",
    color: "#666",
  },
})
