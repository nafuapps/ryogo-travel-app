//Landing
export const HOMEPAGE_URL = "https://ryogo.in"
export const SLIDESHOW_TIMER_MS = 5000

//Regex constants
export const MIN_PASSWORD_LENGTH = 8
export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30
export const PHONE_LENGTH = 10
export const MAX_EMAIL_LENGTH = 60
export const MAX_FILE_UPLOAD_SIZE = 500000 //File must be less than 500kB
export const MIN_AMOUNT_LIMIT = 0 //Minimum amount user can enter (in Rs)
export const MAX_AMOUNT_LIMIT = 1000000 //Maximum amount user can enter (in Rs)
export const MIN_LICENSE_LENGTH = 10 //Minimum license number length
export const MAX_LICENSE_LENGTH = 20 //Maximum license number length
export const MIN_VEHICLE_NUMBER_LENGTH = 7 //Minimum vehicle number length
export const MAX_VEHICLE_NUMBER_LENGTH = 15 //Maximum vehicle number length
export const MIN_VEHICLE_CAPCITY = 0 //Minimum vehicle passenger capacity
export const MAX_VEHICLE_CAPCITY = 100 //Maximum vehicle passenger capacity
export const MIN_VEHICLE_RATE = 0 //Minimum vehicle rate user can enter (in Rs/Km)
export const MAX_VEHICLE_RATE = 100 //Maximum vehicle rate user can enter (in Rs/Km)
export const MIN_PER_DAY_CHARGE = 0 //Minimum driver allowance/ac charge user can enter (in Rs/day)
export const MAX_PER_DAY_CHARGE = 10000 //Maximum driver allowance/ac charge user can enter (in Rs/day)
export const MIN_COMMISSION_RATE = 0 //Minimum commission rate user can enter (in %)
export const MAX_COMMISSION_RATE = 100 //Maximum commission rate user can enter (in %)
export const MIN_ODOMETER_LIMIT = 1 //Minimum odometer reading user can enter (in Km)
export const MAX_ODOMETER_LIMIT = 1000000 //Maximum odometer reading user can enter (in Km)
export const MIN_FIELD_TITLE_LENGTH = 3
export const MAX_FIELD_TITLE_LENGTH = 50
export const MIN_FIELD_DESC_LENGTH = 10
export const MAX_FIELD_DESC_LENGTH = 300
export const MIN_ENTITY_ID_LENGTH = 8
export const MAX_ENTITY_ID_LENGTH = 12

//Onboarding
export const CreateAccountTotalSteps = 5
export const VerifyAccountTotalSteps = 1
export const AddVehicleTotalSteps = 5
export const AddDriverTotalSteps = 4
export const AddAgentTotalSteps = 2
export const VERIFY_CODE_TIMEOUT_MINUTES = 3 //Waiting before resending code

//Dashboard
export const DASHBOARD_USER_ONLINE_MINUTES = 10
export const DASHBOARD_USER_AWAY_MINUTES = 30

//Bookings
export const NewBookingTotalSteps = 5
export const OLD_LEAD_AUTO_CANCEL_DAYS = 1 //Auto cancel lead booking if start date has elapsed by X days
export const SEND_REFRESH_TIMEOUT_MINUTES = 5 //Waiting before resending document to customer
export const NEW_BOOKING_DEFAULT_DISTANCE = 1
export const NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY = 0
export const NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM = 18
export const NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY = 500

//Subscription
export const APP_TRIAL_MODE = false //If this is true, all Premium features are unlocked for every user

export const BASIC_PLAN_DRIVER_LIMIT = 4
export const BASIC_PLAN_AGENT_LIMIT = 4
export const BASIC_PLAN_VEHICLE_LIMIT = 4
export const BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT = 20
export const BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS = 7

export const SUBSCRIPTION_EXPIRY_REMINDER_DAYS = 5
export const SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS = 2

//Expiry Alerts
export const EXPIRY_WARNING_DAYS = 7

//Support
export const TOTAL_RATING_STARS = 5
export const MAX_USER_COMMENTS_PER_TICKET = 5
export const SUPPORT_HELPLINE_NUMBER = "9840774089"
export const SUPPORT_CHAT_NUMBER = "9840774089"
export const SUPPORT_EMAIL = "ryogo.in@gmail.com"
//RyoGo logo in email and pdf footer
export const RyogoLogoSrc =
  "https://uxlvdjfgmmorufabopzd.supabase.co/storage/v1/object/public/ryogoDocs/ryogo/logo/logo.png"

//TODO: Social Media
export const YT_LINK = "https://www.youtube.com/@ryogoapp"
export const IG_LINK = "https://www.instagram.com/ryogoapp/"
export const FB_LINK = "https://www.facebook.com/ryogoapp/"
export const LI_LINK = "https://www.linkedin.com/ryogoapp/"
export const NAFUAPPS_LINK = "https://nafuapps.in/"
