export const HOST_URL = "https://ryogo.in"

//Cookies
export const LOCALE_COOKIE_NAME = "locale"
export const DARK_MODE_COOKIE_NAME = "dark"
export const SESSION_COOKIE_NAME = "session"
export const SESSION_COOKIE_EXPIRATION_DAYS = 14 // Align with JWT in session encrypt
export const SESSION_COOKIE_REFRESH_INTERVAL_MINUTES = 15

//Bookings
export const BASIC_SEARCH_LIMIT_DAYS = 30
export const PREMIUM_BOOKINGS_SEARCH_DAYS = 365

export const UPDATE_PRICE_DISTANCE_FACTOR = 1.1 //Actual distance = 1.1x estimated distance

export const BOOKING_ASSIGNMENT_CRITICAL_DAYS = 1

export const MULTI_DAY_TRIP_INTERMEDIATE_DAYS_DISTANCE = 50 //Km

export const OTHER_TRIP_LOG_INTERVAL_MINUTES = 15 //Minutes

export const BOOKING_RATING_LIMIT_DAYS = 30
export const BOOKING_SCHEDULE_DEFAULT_DAYS = 7

//Orders
export const EXISTING_ORDER_SEARCH_HOURS = 24 //Look for an existing created subscription order in past 24hrs, else create a new order

//Subscription
export const PREMIUM_TRIAL_DAYS = 30

export const MONTHLY_SUBSCRIPTION_DAYS = 30
export const QUARTERLY_SUBSCRIPTION_DAYS = 90
export const ANNUAL_SUBSCRIPTION_DAYS = 365

//Billing
//MRP just for display (before discount)
export const MONTHLY_SUBSCRIPTION_MRP = 499
export const QUARTERLY_SUBSCRIPTION_MRP = MONTHLY_SUBSCRIPTION_MRP * 3
export const ANNUAL_SUBSCRIPTION_MRP = MONTHLY_SUBSCRIPTION_MRP * 12

//Final prices used for payment (after discount)
export const MONTHLY_SUBSCRIPTION_FINAL_PRICE = 499
export const QUARTERLY_SUBSCRIPTION_FINAL_PRICE = 1299
export const ANNUAL_SUBSCRIPTION_FINAL_PRICE = 3999

export const GST_PERCENTAGE = 18

//Route
export const DISTANCE_RATIO_CHECK_THRESHOLD = 10 //Less than this, don't check user distance input for new booking
export const MIN_USER_DISTANCE_RATIO = 0.8 //User distance input should be within this ratio of db value
export const MAX_USER_DISTANCE_RATIO = 1.2

//Missions
export const READ_MISSION_WINDOW_DAYS = 3
export const EXPIRATION_ALERT_WINDOW_DAYS = 15

//Users
export const LOCATE_USER_MINUTES = 15

//Dashboard
export const DASHBOARD_FETCH_DAYS = 7
