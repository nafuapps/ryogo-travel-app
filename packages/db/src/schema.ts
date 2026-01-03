import { relations, sql } from "drizzle-orm"
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  time,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
  geometry,
} from "drizzle-orm/pg-core"

//ID initials
export const agencyInitial = "A"
export const userInitial = "U"
export const sessionInitial = "S"
export const vehicleInitial = "V"
export const driverInitial = "D"
export const routeInitial = "R"
export const customerInitial = "C"
export const bookingInitial = "B"
export const expenseInitial = "E"
export const tripLogInitial = "TL"
export const transactionInitial = "T"
export const locationInitial = "L"
export const vehicleRepairInitial = "VR"
export const driverLeaveInitial = "DL"

//Common timestamps
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
}

//Common Sequence values
const sequenceValues = {
  startWith: 1000000,
  maxValue: 9999999,
  minValue: 1000000,
  increment: 1,
}

export enum AgencyStatusEnum {
  NEW = "new",
  ACTIVE = "active",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}
export const agencyStatus = pgEnum("agency_status", [
  AgencyStatusEnum.NEW,
  AgencyStatusEnum.ACTIVE,
  AgencyStatusEnum.EXPIRED,
  AgencyStatusEnum.SUSPENDED,
])
export enum SubscriptionPlanEnum {
  TRIAL = "trial",
  PREMIUM = "premium",
}
export const subscriptionPlan = pgEnum("subscription_plan", [
  SubscriptionPlanEnum.TRIAL,
  SubscriptionPlanEnum.PREMIUM,
])
//Agencies table
export const agencyIdSequence = pgSequence("agency_id_seq", {
  ...sequenceValues,
})
export const agencies = pgTable(
  "agencies",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${agencyInitial} || nextval(${"agency_id_seq"})`
      }),
    businessName: varchar("business_name", { length: 30 }).notNull(),
    businessPhone: varchar("business_phone", { length: 10 }).notNull(),
    businessEmail: varchar("business_email", { length: 60 }).notNull(),
    businessAddress: varchar("business_address", { length: 300 }).notNull(),
    logoUrl: text("logo_url"),
    subscriptionPlan: subscriptionPlan()
      .notNull()
      .default(SubscriptionPlanEnum.TRIAL),
    subscriptionExpiresOn: timestamp("subscription_expires_on", {
      withTimezone: true,
    }).notNull(),
    status: agencyStatus().notNull().default(AgencyStatusEnum.NEW),
    defaultCommissionRate: integer("default_commission_rate")
      .notNull()
      .default(15), // percentage
    locationId: text("location_id")
      .references(() => locations.id, { onDelete: "no action" })
      .notNull(),
    ...timestamps,
  },
  (t) => [
    unique().on(t.businessPhone, t.businessEmail), //Same agency can be added again but with different phone+email
    check(
      "commission_rate >= 0 AND commission_rate <= 100",
      sql`${t.defaultCommissionRate} >= 0 AND ${t.defaultCommissionRate} <= 100`
    ),
    index("agencies_subscription_expiry_idx").on(t.subscriptionExpiresOn), // to quickly find agencies with expired subscriptions
    index("agencies_status_idx").on(t.status), // to quickly filter agencies by status
    index("agencies_location_idx").on(t.locationId), // to quickly filter agencies by location
  ]
)
export const agenciesRelations = relations(agencies, ({ many, one }) => ({
  locations: one(locations, {
    fields: [agencies.locationId],
    references: [locations.id],
  }),
  users: many(users),
  vehicles: many(vehicles),
  drivers: many(drivers),
  customers: many(customers),
  bookings: many(bookings),
  expenses: many(expenses),
  transactions: many(transactions),
  vehicleRepairs: many(vehicleRepairs),
  driverLeaves: many(driverLeaves),
  tripLogs: many(tripLogs),
}))

export enum UserLangEnum {
  ENGLISH = "en",
  HINDI = "hi",
  ASSAMESE = "as",
}
export const userLangs = pgEnum("user_langs", [
  UserLangEnum.ENGLISH,
  UserLangEnum.HINDI,
  UserLangEnum.ASSAMESE,
])
export enum UserRolesEnum {
  AGENT = "agent",
  OWNER = "owner",
  DRIVER = "driver",
}
export const userRoles = pgEnum("user_roles", [
  UserRolesEnum.AGENT,
  UserRolesEnum.OWNER,
  UserRolesEnum.DRIVER,
])
export enum UserStatusEnum {
  NEW = "new",
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}
export const userStatus = pgEnum("user_status", [
  UserStatusEnum.NEW,
  UserStatusEnum.ACTIVE,
  UserStatusEnum.INACTIVE,
  UserStatusEnum.SUSPENDED,
])
//Users table
export const userIdSequence = pgSequence("user_id_seq", {
  ...sequenceValues,
})
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${userInitial} || nextval(${"user_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 30 }).notNull(),
    phone: varchar("phone", { length: 10 }).notNull(),
    email: varchar("email", { length: 60 }).notNull(),
    password: text("password").notNull(),
    photoUrl: text("photo_url"),
    isAdmin: boolean().default(false),
    prefersDarkTheme: boolean().default(false),
    languagePref: userLangs().notNull().default(UserLangEnum.ENGLISH),
    userRole: userRoles().notNull().default(UserRolesEnum.AGENT),
    status: userStatus().notNull().default(UserStatusEnum.NEW),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    lastLogout: timestamp("last_logout", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    unique().on(t.agencyId, t.phone, t.userRole), //Owner or Agent can also be a driver
    unique().on(t.phone, t.email, t.userRole), //same user can be added to multiple agencies but with different email or role
    uniqueIndex("users_agency_role_phone_idx").on(
      t.agencyId,
      t.phone,
      t.userRole
    ), // to quickly find unique user with phone number & role in an agency
    uniqueIndex("users_phone_email_role_idx").on(t.phone, t.email, t.userRole),
    index("users_agency_idx").on(t.agencyId), // to quickly filter all users in an agency
    index("users_agency_phone_idx").on(t.phone, t.agencyId), // to quickly filter users by phone number in an agency
    index("users_agency_role_idx").on(t.userRole, t.agencyId), // to quickly filter users by role in an agency
    index("users_agency_status_idx").on(t.status, t.agencyId), // to quickly filter users by status in an agency
  ]
)
export const usersRelations = relations(users, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [users.agencyId],
    references: [agencies.id],
  }),
  driver: one(drivers),
  bookingsAssigned: many(bookings, {
    relationName: "bookings_assigned_user_fkey",
  }),
  bookingsBooked: many(bookings, {
    relationName: "bookings_booked_by_user_fkey",
  }),
  expensesAdded: many(expenses),
  transactionsAdded: many(transactions),
  vehicleRepairsAdded: many(vehicleRepairs),
  driverLeavesAdded: many(driverLeaves),
  customersAdded: many(customers),
  sessions: many(sessions),
}))

//Sessions table
export const sessionIdSequence = pgSequence("session_id_seq", {
  ...sequenceValues,
})
export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${sessionInitial} || nextval(${"session_id_seq"})`
      }),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    index("sessions_user_idx").on(t.userId), // to quickly filter sessions by user
  ]
)
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export enum VehicleTypesEnum {
  CAR = "car",
  BIKE = "bike",
  BUS = "bus",
  TRUCK = "truck",
  OTHER = "other",
}
export const vehicleTypes = pgEnum("vehicle_types", [
  VehicleTypesEnum.CAR,
  VehicleTypesEnum.BIKE,
  VehicleTypesEnum.BUS,
  VehicleTypesEnum.OTHER,
  VehicleTypesEnum.TRUCK,
])
export enum VehicleStatusEnum {
  AVAILABLE = "available",
  ON_TRIP = "on trip",
  REPAIR = "repair",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}
export const vehicleStatus = pgEnum("vehicle_status", [
  VehicleStatusEnum.AVAILABLE,
  VehicleStatusEnum.ON_TRIP,
  VehicleStatusEnum.REPAIR,
  VehicleStatusEnum.INACTIVE,
  VehicleStatusEnum.SUSPENDED,
])
//Vehicles table
export const vehicleIdSequence = pgSequence("vehicle_id_seq", {
  ...sequenceValues,
})
export const vehicles = pgTable(
  "vehicles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${vehicleInitial} || nextval(${"vehicle_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    vehicleNumber: varchar("vehicle_number", { length: 15 }).notNull(),
    brand: varchar("brand", { length: 15 }).notNull(),
    model: varchar("model", { length: 30 }).notNull(),
    color: varchar("color", { length: 15 }).notNull(),
    insuranceExpiresOn: date("insurance_expires_on", { mode: "string" }),
    pucExpiresOn: date("puc_expires_on", { mode: "string" }),
    odometerReading: integer("odometer_reading").notNull().default(0), // in kilometers
    capacity: integer("capacity").notNull().default(4), //number of seats
    hasAC: boolean("has_ac").notNull(),
    type: vehicleTypes().notNull().default(VehicleTypesEnum.CAR),
    status: vehicleStatus().notNull().default(VehicleStatusEnum.AVAILABLE),
    insurancePhotoUrl: text("insurance_photo_url"),
    pucPhotoUrl: text("puc_photo_url"),
    rcPhotoUrl: text("rc_photo_url"),
    vehiclePhotoUrl: text("vehicle_photo_url"),
    defaultRatePerKm: integer("default_rate_per_km").notNull().default(18), // in currency units
    defaultAcChargePerDay: integer("extra_ac_charge_per_day")
      .notNull()
      .default(0), // in currency units
    ...timestamps,
  },
  (t) => [
    unique().on(t.vehicleNumber, t.agencyId), //same vehicle can be added to different agencies
    check(
      "capacity > 0 and < 100",
      sql`${t.capacity} > 0 AND ${t.capacity} < 100`
    ),
    check(
      "odometer >= 0 and < 1000000",
      sql`${t.odometerReading} >= 0 AND ${t.odometerReading} < 1000000`
    ),
    check(
      "rate per km > 0 and < 100",
      sql`${t.defaultRatePerKm} > 0 AND ${t.defaultRatePerKm} < 100`
    ),
    check("ac charge < 10000", sql`${t.defaultAcChargePerDay} < 10000`),
    index("vehicles_agency_idx").on(t.agencyId), // to quickly filter all vehicles in an agency
    index("vehicles_agency_status_idx").on(t.status, t.agencyId), // to quickly filter vehicles by status in an agency
    index("vehicles_agency_type_idx").on(t.type, t.agencyId), // to quickly filter vehicles by type in an agency
    index("vehicles_agency_capacity_idx").on(t.capacity, t.agencyId), // to quickly filter vehicles by capacity in an agency
    index("vehicles_agency_ac_idx").on(t.hasAC, t.agencyId), // to quickly filter vehicles by ac in an agency
  ]
)
export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [vehicles.agencyId],
    references: [agencies.id],
  }),
  assignedBookings: many(bookings),
  vehicleRepairs: many(vehicleRepairs),
  tripLogs: many(tripLogs),
}))

export enum DriverStatusEnum {
  AVAILABLE = "available",
  ON_TRIP = "on trip",
  LEAVE = "leave",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}
export const driverStatus = pgEnum("driver_status", [
  DriverStatusEnum.AVAILABLE,
  DriverStatusEnum.ON_TRIP,
  DriverStatusEnum.LEAVE,
  DriverStatusEnum.INACTIVE,
  DriverStatusEnum.SUSPENDED,
])
//Drivers table
export const driverIdSequence = pgSequence("driver_id_seq", {
  ...sequenceValues,
})
export const drivers = pgTable(
  "drivers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${driverInitial} || nextval(${"driver_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    name: varchar("name", { length: 30 }).notNull(),
    phone: varchar("phone", { length: 10 }).notNull(),
    address: varchar("address", { length: 300 }).notNull(),
    licenseNumber: varchar("license_number", { length: 20 }).notNull(),
    licenseExpiresOn: date("license_expires_on", { mode: "string" }),
    status: driverStatus().notNull().default(DriverStatusEnum.AVAILABLE),
    licensePhotoUrl: text("license_photo_url"),
    canDriveVehicleTypes: vehicleTypes()
      .array()
      .notNull()
      .default([VehicleTypesEnum.CAR]),
    defaultAllowancePerDay: integer("default_allowance_per_day")
      .notNull()
      .default(500), // in currency units
    ...timestamps,
  },
  (t) => [
    unique().on(t.phone, t.agencyId), //same driver can be added to different agencies
    check(
      "allowance >=0 and < 10000",
      sql`${t.defaultAllowancePerDay} >=0 AND ${t.defaultAllowancePerDay} < 10000`
    ),
    index("drivers_agency_idx").on(t.agencyId), // to quickly filter all drivers in an agency
    index("drivers_agency_status_idx").on(t.status, t.agencyId), // to quickly filter drivers by status in an agency
    index("drivers_agency_drive_type_idx").on(
      t.canDriveVehicleTypes,
      t.agencyId
    ), // to quickly filter drivers by vehicle types in an agency
  ]
)
export const driverRelations = relations(drivers, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [drivers.agencyId],
    references: [agencies.id],
  }),
  user: one(users, { fields: [drivers.userId], references: [users.id] }),
  assignedBookings: many(bookings),
  driverLeaves: many(driverLeaves),
  tripLogs: many(tripLogs),
}))

//Routes table
export const routeIdSequence = pgSequence("route_id_seq", {
  ...sequenceValues,
})
export const routes = pgTable(
  "routes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${routeInitial} || nextval(${"route_id_seq"})`
      }),
    sourceId: text("source_id")
      .references(() => locations.id, { onDelete: "cascade" })
      .notNull(),
    destinationId: text("destination_id")
      .references(() => locations.id, { onDelete: "cascade" })
      .notNull(),
    distance: integer("distance").notNull(), // in kilometers
    estimatedTime: integer("estimated_time"), // in minutes
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    check(
      "distance > 0 and < 5000",
      sql`${t.distance} > 0 AND ${t.distance} < 5000`
    ),
    check(
      "time > 0 and < 10000",
      sql`${t.estimatedTime} > 0 AND ${t.estimatedTime} < 10000`
    ),
    unique().on(t.sourceId, t.destinationId), //same route can be added in reverse direction but not in the same direction
    index("routes_source_idx").on(t.sourceId), // to quickly filter routes by source
    index("routes_destination_idx").on(t.destinationId), // to quickly filter routes by destination
    index("routes_active_idx").on(t.isActive), // to quickly filter active/inactive routes
  ]
)
export const routeRelations = relations(routes, ({ one, many }) => ({
  source: one(locations, {
    fields: [routes.sourceId],
    references: [locations.id],
    relationName: "route_source_fkey",
  }),
  destination: one(locations, {
    fields: [routes.destinationId],
    references: [locations.id],
    relationName: "route_destination_fkey",
  }),
  bookings: many(bookings),
}))

export enum CustomerStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}
export const customerStatus = pgEnum("customer_status", [
  CustomerStatusEnum.ACTIVE,
  CustomerStatusEnum.INACTIVE,
  CustomerStatusEnum.SUSPENDED,
])
//Customers table
export const customerIdSequence = pgSequence("customer_id_seq", {
  ...sequenceValues,
})
export const customers = pgTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${customerInitial} || nextval(${"customer_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 30 }).notNull(),
    phone: varchar("phone", { length: 10 }).notNull(),
    email: varchar("email", { length: 60 }),
    address: varchar("address", { length: 300 }),
    photoUrl: text("photo_url"),
    addedByUserId: text("added_by_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    locationId: text("location_id")
      .references(() => locations.id, { onDelete: "no action" })
      .notNull(),
    remarks: text("remarks"),
    status: customerStatus().notNull().default(CustomerStatusEnum.ACTIVE),
    ...timestamps,
  },
  (t) => [
    unique().on(t.phone, t.agencyId), //same customer can be added to different agencies
    index("customers_agency_idx").on(t.agencyId), // to quickly filter all customers in an agency
    index("customers_agency_user_idx").on(t.addedByUserId, t.agencyId), // to quickly filter customers added by a user in an agency
    index("customers_agency_status_idx").on(t.status, t.agencyId), // to quickly filter customers by status in an agency
    index("customers_agency_location_idx").on(t.locationId, t.agencyId), // to quickly filter customers by location in an agency
    index("customers_phone_idx").on(t.phone), // to quickly filter customers by phone number across agencies (quick search in a new booking)
  ]
)
export const customerRelations = relations(customers, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [customers.agencyId],
    references: [agencies.id],
  }),
  location: one(locations, {
    fields: [customers.locationId],
    references: [locations.id],
  }),
  addedByUser: one(users, {
    fields: [customers.addedByUserId],
    references: [users.id],
  }),
  bookings: many(bookings),
}))

export enum BookingStatusEnum {
  LEAD = "lead",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RECONCILED = "reconciled",
}
export const bookingStatus = pgEnum("booking_status", [
  BookingStatusEnum.LEAD,
  BookingStatusEnum.CONFIRMED,
  BookingStatusEnum.IN_PROGRESS,
  BookingStatusEnum.COMPLETED,
  BookingStatusEnum.CANCELLED,
  BookingStatusEnum.RECONCILED,
])
export enum BookingTypeEnum {
  OneWay = "one way",
  Round = "round trip",
  MultiDay = "multi day",
}
export const bookingType = pgEnum("booking_type", [
  BookingTypeEnum.OneWay,
  BookingTypeEnum.Round,
  BookingTypeEnum.MultiDay,
])
//Bookings table
export const bookingIdSequence = pgSequence("booking_id_seq", {
  ...sequenceValues,
})
export const bookings = pgTable(
  "bookings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${bookingInitial} || nextval(${"booking_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    customerId: text("customer_id")
      .references(() => customers.id, { onDelete: "no action" })
      .notNull(),
    assignedVehicleId: text("assigned_vehicle_id").references(
      () => vehicles.id,
      { onDelete: "set null" }
    ),
    assignedDriverId: text("assigned_driver_id").references(() => drivers.id, {
      onDelete: "set null",
    }),
    bookedByUserId: text("booked_by_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    assignedUserId: text("assigned_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    sourceId: text("source_id")
      .references(() => locations.id, { onDelete: "no action" })
      .notNull(),
    destinationId: text("destination_id")
      .references(() => locations.id, { onDelete: "no action" })
      .notNull(),
    routeId: text("route_id").references(() => routes.id, {
      onDelete: "set null",
    }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    startTime: time("start_time", { withTimezone: false }),
    pickupAddress: varchar("pickup_address", { length: 300 }),
    dropAddress: varchar("drop_address", { length: 300 }),
    type: bookingType().notNull().default(BookingTypeEnum.OneWay),
    passengers: integer("passengers").notNull().default(1), //0 means its a non-passenger (truck) trip
    needsAc: boolean("needs_ac").notNull().default(true),
    remarks: text("remarks"),
    citydistance: integer("city_distance").notNull().default(0), // in kilometers (distance between cities)
    totalDistance: integer("total_distance").notNull().default(0), // in kilometers (total distance of the trip)
    acChargePerDay: integer("ac_charge_per_day").notNull().default(0), // in currency
    totalAcCharge: integer("total_ac_charge").notNull().default(0), // in currency
    ratePerKm: integer("rate_per_km").notNull().default(18), // in currency
    totalVehicleRate: integer("total_vehicle_rate").notNull().default(0), // in currency
    allowancePerDay: integer("allowance_per_day").notNull().default(500), // in currency
    totalDriverAllowance: integer("total_driver_allowance")
      .notNull()
      .default(0), // in currency
    commissionRate: integer("commission_rate").notNull().default(15), // in percentage
    totalCommission: integer("total_commission").notNull().default(0), // in currency
    totalAmount: integer("total_amount").notNull().default(0), // in currency
    ratingByDriver: integer("rating_by_driver"), // 1 to 5
    ratingByCustomer: integer("rating_by_customer"), // 1 to 5
    status: bookingStatus().notNull().default(BookingStatusEnum.LEAD),
    ...timestamps,
  },
  (t) => [
    check(
      "commission_rate >= 0 AND commission_rate <= 100",
      sql`${t.commissionRate} >= 0 AND ${t.commissionRate} <= 100`
    ),
    check(
      "passengers >= 0 and < 100",
      sql`${t.passengers} >= 0 AND ${t.passengers} < 100`
    ),
    check("ac charge per day  < 10000", sql`${t.acChargePerDay} < 10000`),
    check(
      "rate per km > 0 and < 100",
      sql`${t.ratePerKm} > 0 AND ${t.ratePerKm} < 100`
    ),
    check(
      "allowance >= 0 and allowance < 10000",
      sql`${t.allowancePerDay} >= 0 AND ${t.allowancePerDay} < 10000`
    ),
    check("end_date >= start_date", sql`${t.endDate} >= ${t.startDate}`),
    check(
      "total_amount > 0 and < 1000000",
      sql`${t.totalAmount} > 0 AND ${t.totalAmount} < 1000000`
    ),
    check(
      "driver rating >=1 and rating <=5",
      sql`${t.ratingByDriver} >=1 AND ${t.ratingByDriver} <=5`
    ),
    check(
      "customer rating >=1 and rating <=5",
      sql`${t.ratingByCustomer} >=1 AND ${t.ratingByCustomer} <=5`
    ),
    index("bookings_agency_idx").on(t.agencyId), // to quickly filter all bookings in an agency
    index("bookings_agency_status_idx").on(t.status, t.agencyId), // to quickly filter bookings by status in an agency
    index("bookings_agency_customer_idx").on(t.customerId, t.agencyId), // to quickly filter bookings by customer in an agency
    index("bookings_agency_assigned_user_idx").on(t.assignedUserId, t.agencyId), // to quickly filter bookings by assigned user in an agency
    index("bookings_agency_booked_by_user_idx").on(
      t.bookedByUserId,
      t.agencyId
    ), // to quickly filter bookings by booked by user in an agency
    index("bookings_agency_driver_idx").on(t.assignedDriverId, t.agencyId), // to quickly filter bookings by assigned driver in an agency
    index("bookings_agency_vehicle_idx").on(t.assignedVehicleId, t.agencyId), // to quickly filter bookings by assigned vehicle in an agency
    index("bookings_agency_start_date_idx").on(t.startDate, t.agencyId), // to quickly filter bookings by start date in an agency
    index("bookings_agency_end_date_idx").on(t.endDate, t.agencyId), // to quickly filter bookings by end date in an agency
    index("bookings_agency_source_idx").on(t.sourceId, t.agencyId), // to quickly filter bookings by source location in an agency
    index("bookings_agency_destination_idx").on(t.destinationId, t.agencyId), // to quickly filter bookings by destination location in an agency
    index("bookings_agency_route_idx").on(t.routeId, t.agencyId), // to quickly filter bookings by route in an agency
    index("bookings_agency_type_idx").on(t.type, t.agencyId), // to quickly filter bookings by type in an agency
  ]
)
export const bookingRelations = relations(bookings, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [bookings.agencyId],
    references: [agencies.id],
  }),
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  assignedUser: one(users, {
    fields: [bookings.assignedUserId],
    references: [users.id],
    relationName: "bookings_assigned_user_fkey",
  }),
  bookedByUser: one(users, {
    fields: [bookings.bookedByUserId],
    references: [users.id],
    relationName: "bookings_booked_by_user_fkey",
  }),
  assignedVehicle: one(vehicles, {
    fields: [bookings.assignedVehicleId],
    references: [vehicles.id],
  }),
  assignedDriver: one(drivers, {
    fields: [bookings.assignedDriverId],
    references: [drivers.id],
  }),
  source: one(locations, {
    fields: [bookings.sourceId],
    references: [locations.id],
    relationName: "booking_source_fkey",
  }),
  destination: one(locations, {
    fields: [bookings.destinationId],
    references: [locations.id],
    relationName: "booking_destination_fkey",
  }),
  route: one(routes, { fields: [bookings.routeId], references: [routes.id] }),
  tripLogs: many(tripLogs),
  expenses: many(expenses),
  transactions: many(transactions),
}))

export enum ExpenseTypesEnum {
  FUEL = "fuel",
  TOLL = "toll",
  PARKING = "parking",
  MAINTENANCE = "maintenance",
  AC = "ac",
  FOOD = "food",
  OTHER = "other",
}
export const expenseTypes = pgEnum("expense_types", [
  ExpenseTypesEnum.FUEL,
  ExpenseTypesEnum.TOLL,
  ExpenseTypesEnum.PARKING,
  ExpenseTypesEnum.MAINTENANCE,
  ExpenseTypesEnum.AC,
  ExpenseTypesEnum.FOOD,
  ExpenseTypesEnum.OTHER,
])
//Expenses table
export const expenseIdSequence = pgSequence("expense_id_seq", {
  ...sequenceValues,
})
export const expenses = pgTable(
  "expenses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${expenseInitial} || nextval(${"expense_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, {
        onDelete: "cascade",
      }),
    addedByUserId: text("added_by_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    type: expenseTypes().notNull().default(ExpenseTypesEnum.OTHER),
    amount: integer("amount").notNull(), // in currency units
    remarks: text("remarks"),
    expensePhotoUrl: text("expense_photo_url"),
    isApproved: boolean("is_approved").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    check(
      "amount > 0 and < 1000000",
      sql`${t.amount} > 0 AND ${t.amount} < 1000000`
    ),
    index("expenses_booking_idx").on(t.bookingId), // to quickly filter expenses by booking
    index("expenses_booking_type_idx").on(t.type, t.bookingId), // to quickly filter expenses by type in a booking
    index("expenses_booking_approved_idx").on(t.isApproved, t.bookingId), // to quickly filter expenses by approval status in a booking
    index("expenses_agency_user_idx").on(t.addedByUserId, t.agencyId), // to quickly filter expenses added by a user in an agency
  ]
)
export const expenseRelations = relations(expenses, ({ one }) => ({
  agency: one(agencies, {
    fields: [expenses.agencyId],
    references: [agencies.id],
  }),
  booking: one(bookings, {
    fields: [expenses.bookingId],
    references: [bookings.id],
  }),
  addedByUser: one(users, {
    fields: [expenses.addedByUserId],
    references: [users.id],
  }),
}))

export enum TripLogTypesEnum {
  START_TRIP = "trip started",
  END_TRIP = "trip ended",
  ARRIVED = "arrived",
  PICKUP = "picked up",
  DROP = "dropped",
}
export const tripLogTypes = pgEnum("trip_log_types", [
  TripLogTypesEnum.START_TRIP,
  TripLogTypesEnum.END_TRIP,
  TripLogTypesEnum.ARRIVED,
  TripLogTypesEnum.PICKUP,
  TripLogTypesEnum.DROP,
])
//Trip Logs table
export const tripLogIdSequence = pgSequence("trip_log_id_seq", {
  ...sequenceValues,
})
export const tripLogs = pgTable(
  "trip_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${tripLogInitial} || nextval(${"trip_log_id_seq"})`
      }),
    bookingId: text("booking_id")
      .references(() => bookings.id, { onDelete: "cascade" })
      .notNull(),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    vehicleId: text("vehicle_id")
      .references(() => vehicles.id, { onDelete: "no action" })
      .notNull(),
    driverId: text("driver_id")
      .references(() => drivers.id, { onDelete: "no action" })
      .notNull(),
    odometerReading: integer("odometer_reading").notNull(), // in kilometers
    type: tripLogTypes().notNull(),
    remarks: text("remarks"),
    tripLogPhotoUrl: text("trip_log_photo_url"),
    latLong: varchar("lat_long", { length: 50 }), // "lat,long"
    ...timestamps,
  },
  (t) => [
    check(
      "odometer >= 0 and < 1000000",
      sql`${t.odometerReading} >= 0 AND ${t.odometerReading} < 1000000`
    ),
    index("trip_logs_booking_idx").on(t.bookingId), // to quickly filter trip logs by booking
    index("trip_logs_booking_type_idx").on(t.type, t.bookingId), // to quickly filter trip logs by type in a booking
    index("trip_logs_agency_vehicle_idx").on(t.vehicleId, t.agencyId), // to quickly filter trip logs by vehicle in an agency
    index("trip_logs_agency_driver_idx").on(t.driverId, t.agencyId), // to quickly filter trip logs by driver in an agency
  ]
)
export const tripLogsRelations = relations(tripLogs, ({ one }) => ({
  agency: one(agencies, {
    fields: [tripLogs.agencyId],
    references: [agencies.id],
  }),
  booking: one(bookings, {
    fields: [tripLogs.bookingId],
    references: [bookings.id],
  }),
  driver: one(drivers, {
    fields: [tripLogs.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [tripLogs.vehicleId],
    references: [vehicles.id],
  }),
}))

export enum TransactionTypesEnum {
  DEBIT = "debit",
  CREDIT = "credit",
}
export const transactionTypes = pgEnum("transaction_types", [
  TransactionTypesEnum.DEBIT,
  TransactionTypesEnum.CREDIT,
])
export enum TransactionsPartiesEnum {
  DRIVER = "driver",
  CUSTOMER = "customer",
}
export const transactionParties = pgEnum("transaction_parties", [
  TransactionsPartiesEnum.DRIVER,
  TransactionsPartiesEnum.CUSTOMER,
])
export enum TransactionModesEnum {
  CASH = "cash",
  CARD = "card",
  NET_BANKING = "net banking",
  UPI = "upi",
  OTHER = "other",
}
export const transactionModes = pgEnum("transaction_modes", [
  TransactionModesEnum.CASH,
  TransactionModesEnum.CARD,
  TransactionModesEnum.NET_BANKING,
  TransactionModesEnum.UPI,
  TransactionModesEnum.OTHER,
])
//Transactions table
export const transactionIdSequence = pgSequence("transaction_id_seq", {
  ...sequenceValues,
})
export const transactions = pgTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${transactionInitial} || nextval(${"transaction_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, {
        onDelete: "cascade",
      }),
    addedByUserId: text("added_by_user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "no action",
      }),
    amount: integer("amount").notNull(), // in currency units
    otherParty: transactionParties()
      .notNull()
      .default(TransactionsPartiesEnum.CUSTOMER),
    type: transactionTypes().notNull().default(TransactionTypesEnum.CREDIT),
    mode: transactionModes().notNull().default(TransactionModesEnum.CASH),
    remarks: text("remarks"),
    transactionPhotoUrl: text("transaction_photo_url"),
    isApproved: boolean("is_approved").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    check(
      "amount > 0 and < 1000000",
      sql`${t.amount} > 0 AND ${t.amount} < 1000000`
    ),
    index("transactions_booking_idx").on(t.bookingId), // to quickly filter transactions by booking
    index("transactions_booking_type_idx").on(t.type, t.bookingId), // to quickly filter transactions by type in a booking
    index("transactions_booking_party_idx").on(t.otherParty, t.bookingId), // to quickly filter transactions by other party in a booking
    index("transactions_booking_approved_idx").on(t.isApproved, t.bookingId), // to quickly filter transactions by approval status in a booking
    index("transactions_agency_user_idx").on(t.addedByUserId, t.agencyId), // to quickly filter transactions added by a user in an agency
  ]
)
export const transactionRelations = relations(transactions, ({ one }) => ({
  agency: one(agencies, {
    fields: [transactions.agencyId],
    references: [agencies.id],
  }),
  booking: one(bookings, {
    fields: [transactions.bookingId],
    references: [bookings.id],
  }),
  addedByUser: one(users, {
    fields: [transactions.addedByUserId],
    references: [users.id],
  }),
}))

//Locations table
export const locationIdSequence = pgSequence("location_id_seq", {
  ...sequenceValues,
})
export const locations = pgTable(
  "locations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${locationInitial} || nextval(${"location_id_seq"})`
      }),
    city: varchar("city", { length: 30 }).notNull(),
    state: varchar("state", { length: 30 }).notNull(),
    latLong: varchar("lat_long", { length: 50 }), // "lat,long"
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    unique().on(t.city, t.state), //same location cannot be added twice
    index("locations_active_idx").on(t.isActive), // to quickly filter active/inactive locations
    index("locations_spatial_idx").using("gist", t.location), // to quickly filter locations by spatial queries
  ]
)
export const locationRelations = relations(locations, ({ many }) => ({
  agencies: many(agencies),
  customers: many(customers),
  bookingSources: many(bookings, { relationName: "booking_source_fkey" }),
  bookingDestinations: many(bookings, {
    relationName: "booking_destination_fkey",
  }),
  routeSources: many(routes, { relationName: "route_source_fkey" }),
  routeDestinations: many(routes, { relationName: "route_destination_fkey" }),
}))

//Vehicle Repairs table
export const vehicleRepairsIdSequence = pgSequence("vehicle_repair_id_seq", {
  ...sequenceValues,
})
export const vehicleRepairs = pgTable(
  "vehicle_repairs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${vehicleRepairInitial} || nextval(${"vehicle_repair_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    vehicleId: text("vehicle_id")
      .references(() => vehicles.id, { onDelete: "cascade" })
      .notNull(),
    addedByUserId: text("added_by_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    cost: integer("cost"),
    isCompleted: boolean("is_completed").notNull().default(false),
    remarks: text("remarks"),
    ...timestamps,
  },
  (t) => [
    check("end_date >= start_date", sql`${t.endDate} >= ${t.startDate}`),
    check(
      "cost >= 0 and < 1000000",
      sql`${t.cost} > 0 AND ${t.cost} < 1000000`
    ),
    index("vehicle_repairs_agency_vehicle_idx").on(t.vehicleId, t.agencyId), // to quickly filter vehicle repairs by vehicle in an agency
    index("vehicle_repairs_agency_user_idx").on(t.addedByUserId, t.agencyId), // to quickly filter vehicle repairs added by a user in an agency
    index("vehicle_repairs_agency_start_date_idx").on(t.startDate, t.agencyId), // to quickly filter vehicle repairs by start date in an agency
    index("vehicle_repairs_agency_end_date_idx").on(t.endDate, t.agencyId), // to quickly filter vehicle repairs by end date in an agency
  ]
)
export const vehicleRepairsRelations = relations(vehicleRepairs, ({ one }) => ({
  agency: one(agencies, {
    fields: [vehicleRepairs.agencyId],
    references: [agencies.id],
  }),
  vehicle: one(vehicles, {
    fields: [vehicleRepairs.vehicleId],
    references: [vehicles.id],
  }),
  addedByUser: one(users, {
    fields: [vehicleRepairs.addedByUserId],
    references: [users.id],
  }),
}))

//Driver Leaves table
export const driverLeaveIdSequence = pgSequence("driverLeave_id_seq", {
  ...sequenceValues,
})
export const driverLeaves = pgTable(
  "driver_leaves",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => {
        return sql`${driverLeaveInitial} || nextval(${"driver_leave_id_seq"})`
      }),
    agencyId: text("agency_id")
      .references(() => agencies.id, { onDelete: "cascade" })
      .notNull(),
    driverId: text("driver_id")
      .references(() => drivers.id, { onDelete: "cascade" })
      .notNull(),
    addedByUserId: text("added_by_user_id")
      .references(() => users.id, { onDelete: "no action" })
      .notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    remarks: text("remarks"),
    ...timestamps,
  },
  (t) => [
    check("end_date >= start_date", sql`${t.endDate} >= ${t.startDate}`),
    index("driver_leaves_agency_driver_idx").on(t.driverId, t.agencyId), // to quickly filter driver leaves by driver in an agency
    index("driver_leaves_agency_user_idx").on(t.addedByUserId, t.agencyId), // to quickly filter driver leaves added by a user in an agency
    index("driver_leaves_agency_start_date_idx").on(t.startDate, t.agencyId), // to quickly filter driver leaves by start date in an agency
    index("driver_leaves_agency_end_date_idx").on(t.endDate, t.agencyId), // to quickly filter driver leaves by end date in an agency
  ]
)
export const driverLeaveRelations = relations(driverLeaves, ({ one }) => ({
  agency: one(agencies, {
    fields: [driverLeaves.agencyId],
    references: [agencies.id],
  }),
  driver: one(drivers, {
    fields: [driverLeaves.driverId],
    references: [drivers.id],
  }),
  addedByUser: one(users, {
    fields: [driverLeaves.addedByUserId],
    references: [users.id],
  }),
}))

//Export types
export type SelectAgencyType = typeof agencies.$inferSelect
export type InsertAgencyType = typeof agencies.$inferInsert

export type SelectUserType = typeof users.$inferSelect
export type InsertUserType = typeof users.$inferInsert

export type SelectSessionType = typeof sessions.$inferSelect
export type InsertSessionType = typeof sessions.$inferInsert

export type SelectVehicleType = typeof vehicles.$inferSelect
export type InsertVehicleType = typeof vehicles.$inferInsert

export type SelectDriverType = typeof drivers.$inferSelect
export type InsertDriverType = typeof drivers.$inferInsert

export type SelectRouteType = typeof routes.$inferSelect
export type InsertRouteType = typeof routes.$inferInsert

export type SelectCustomerType = typeof customers.$inferSelect
export type InsertCustomerType = typeof customers.$inferInsert

export type SelectBookingType = typeof bookings.$inferSelect
export type InsertBookingType = typeof bookings.$inferInsert

export type SelectExpenseType = typeof expenses.$inferSelect
export type InsertExpenseType = typeof expenses.$inferInsert

export type SelectTripLogType = typeof tripLogs.$inferSelect
export type InsertTripLogType = typeof tripLogs.$inferInsert

export type SelectTransactionType = typeof transactions.$inferSelect
export type InsertTransactionType = typeof transactions.$inferInsert

export type SelectLocationType = typeof locations.$inferSelect
export type InsertLocationType = typeof locations.$inferInsert

export type SelectVehicleRepairType = typeof vehicleRepairs.$inferSelect
export type InsertVehicleRepairType = typeof vehicleRepairs.$inferInsert

export type SelectDriverLeaveType = typeof driverLeaves.$inferSelect
export type InsertDriverLeaveType = typeof driverLeaves.$inferInsert
