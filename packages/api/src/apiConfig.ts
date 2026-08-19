//Cookies
export const LOCALE_COOKIE_NAME = "locale"
export const DARK_MODE_COOKIE_NAME = "dark"
export const SESSION_COOKIE_NAME = "session"
export const SESSION_COOKIE_EXPIRATION_DAYS = 7
export const SESSION_COOKIE_UPDATE_HOURS = 1

//Bookings
export const BASIC_BOOKINGS_SEARCH_DAYS = 30
export const PREMIUM_BOOKINGS_SEARCH_DAYS = 365

export const UPDATE_PRICE_DISTANCE_FACTOR = 1.1 //Actual distance = 1.1x estimated distance

export const BOOKING_ASSIGNMENT_CRITICAL_DAYS = 1

//Orders
export const EXISTING_ORDER_SEARCH_HOURS = 24

//Subscription
export const PREMIUM_TRIAL_DAYS = 30

export const MONTHLY_SUBSCRIPTION_DAYS = 30
export const QUARTERLY_SUBSCRIPTION_DAYS = 90
export const ANNUAL_SUBSCRIPTION_DAYS = 365

//Billing
export const MONTHLY_SUBSCRIPTION_MRP = 999
export const QUARTERLY_SUBSCRIPTION_MRP = MONTHLY_SUBSCRIPTION_MRP * 3
export const ANNUAL_SUBSCRIPTION_MRP = MONTHLY_SUBSCRIPTION_MRP * 12

export const MONTHLY_SUBSCRIPTION_FINAL_PRICE = 799
export const QUARTERLY_SUBSCRIPTION_FINAL_PRICE = 2199
export const ANNUAL_SUBSCRIPTION_FINAL_PRICE = 7999

export const GST_PERCENTAGE = 18

//Route
export const MIN_USER_DISTANCE_RATIO = 0.8
export const MAX_USER_DISTANCE_RATIO = 1.2

//Missions
export const MISSION_WINDOW_DAYS = 3
export const EXPIRATION_ALERT_WINDOW_DAYS = 15

//Notifications
export const NOTIFICATION_FEED_WINDOW_DAYS = 30
export const NOTIFICATION_FEED_LIMIT = 100

//Users
export const NEW_USER_DEFAULT_PASSWORD = "12345678"
