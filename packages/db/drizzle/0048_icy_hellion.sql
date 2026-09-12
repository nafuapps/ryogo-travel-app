ALTER TYPE "public"."agency_status"
RENAME VALUE 'new' TO 'New';
--> statement-breakpoint
ALTER TYPE "public"."agency_status"
RENAME VALUE 'active' TO 'Active';
--> statement-breakpoint
ALTER TYPE "public"."agency_status"
RENAME VALUE 'inactive' TO 'Inactive';
--> statement-breakpoint
ALTER TYPE "public"."agency_status"
RENAME VALUE 'suspended' TO 'Suspended';
--> statement-breakpoint
ALTER TYPE "public"."booking_status"
RENAME VALUE 'lead' TO 'Lead';
--> statement-breakpoint
ALTER TYPE "public"."booking_status"
RENAME VALUE 'confirmed' TO 'Confirmed';
--> statement-breakpoint
ALTER TYPE "public"."booking_status"
RENAME VALUE 'in progress' TO 'In Progress';
--> statement-breakpoint
ALTER TYPE "public"."booking_status"
RENAME VALUE 'completed' TO 'Completed';
--> statement-breakpoint
ALTER TYPE "public"."booking_status"
RENAME VALUE 'cancelled' TO 'Cancelled';
--> statement-breakpoint
ALTER TYPE "public"."booking_type"
RENAME VALUE 'one way' TO 'One Way';
--> statement-breakpoint
ALTER TYPE "public"."booking_type"
RENAME VALUE 'round trip' TO 'Round Trip';
--> statement-breakpoint
ALTER TYPE "public"."booking_type"
RENAME VALUE 'multi day' TO 'Multi Day Trip';
--> statement-breakpoint
ALTER TYPE "public"."customer_status"
RENAME VALUE 'active' TO 'Active';
--> statement-breakpoint
ALTER TYPE "public"."customer_status"
RENAME VALUE 'inactive' TO 'Inactive';
--> statement-breakpoint
ALTER TYPE "public"."customer_status"
RENAME VALUE 'suspended' TO 'Suspended';
--> statement-breakpoint
ALTER TYPE "public"."driver_status"
RENAME VALUE 'available' TO 'Available';
--> statement-breakpoint
ALTER TYPE "public"."driver_status"
RENAME VALUE 'on trip' TO 'On Trip';
--> statement-breakpoint
ALTER TYPE "public"."driver_status"
RENAME VALUE 'leave' TO 'Leave';
--> statement-breakpoint
ALTER TYPE "public"."driver_status"
RENAME VALUE 'inactive' TO 'Inactive';
--> statement-breakpoint
ALTER TYPE "public"."driver_status"
RENAME VALUE 'suspended' TO 'Suspended';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'booking' TO 'Booking';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'driver' TO 'Driver';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'vehicle' TO 'Vehicle';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'user' TO 'User';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'agency' TO 'Agency';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'customer' TO 'Customer';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'order' TO 'Order';
--> statement-breakpoint
ALTER TYPE "public"."entity_type"
RENAME VALUE 'expense' TO 'Expense';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'fuel' TO 'Fuel';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'toll' TO 'Toll';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'parking' TO 'Parking';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'maintenance' TO 'Maintenance';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'ac' TO 'AC';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'food' TO 'Food';
--> statement-breakpoint
ALTER TYPE "public"."expense_types"
RENAME VALUE 'other' TO 'Other';
--> statement-breakpoint
ALTER TYPE "public"."order_status"
RENAME VALUE 'created' TO 'Created';
--> statement-breakpoint
ALTER TYPE "public"."order_status"
RENAME VALUE 'attempted' TO 'Attempted';
--> statement-breakpoint
ALTER TYPE "public"."order_status"
RENAME VALUE 'paid' TO 'Paid';
--> statement-breakpoint
ALTER TYPE "public"."order_type"
RENAME VALUE 'monthly' TO 'Monthtly';
--> statement-breakpoint
ALTER TYPE "public"."order_type"
RENAME VALUE 'quarterly' TO 'Quarterly';
--> statement-breakpoint
ALTER TYPE "public"."order_type"
RENAME VALUE 'annual' TO 'Annual';
--> statement-breakpoint
ALTER TYPE "public"."payment_status"
RENAME VALUE 'created' TO 'Created';
--> statement-breakpoint
ALTER TYPE "public"."payment_status"
RENAME VALUE 'authorized' TO 'Authorized';
--> statement-breakpoint
ALTER TYPE "public"."payment_status"
RENAME VALUE 'failed' TO 'Failed';
--> statement-breakpoint
ALTER TYPE "public"."payment_status"
RENAME VALUE 'captured' TO 'Captured';
--> statement-breakpoint
ALTER TYPE "public"."payment_status"
RENAME VALUE 'refunded' TO 'Refunded';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'onboarding' TO 'Onboarding';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'new booking' TO 'New Booking';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'new customer' TO 'New Customer';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'new driver' TO 'New Driver';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'new vehicle' TO 'New Vehicle';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
RENAME VALUE 'new order' TO 'New Order';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
ADD VALUE 'New User';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
ADD VALUE 'Subscription';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
ADD VALUE 'Mission';
--> statement-breakpoint
ALTER TYPE "public"."product_feedback_type"
ADD VALUE 'Analytics';
--> statement-breakpoint
ALTER TYPE "public"."subscription_plan"
RENAME VALUE 'basic' TO 'Basic';
--> statement-breakpoint
ALTER TYPE "public"."subscription_plan"
RENAME VALUE 'premium' TO 'Premium';
--> statement-breakpoint
ALTER TYPE "public"."ticket_status"
RENAME VALUE 'open' TO 'Open';
--> statement-breakpoint
ALTER TYPE "public"."ticket_status"
RENAME VALUE 'in progress' TO 'In Progress';
--> statement-breakpoint
ALTER TYPE "public"."ticket_status"
RENAME VALUE 'resolved' TO 'Resolved';
--> statement-breakpoint
ALTER TYPE "public"."ticket_status"
RENAME VALUE 'closed' TO 'Closed';
--> statement-breakpoint
ALTER TYPE "public"."transaction_modes"
RENAME VALUE 'cash' TO 'Cash';
--> statement-breakpoint
ALTER TYPE "public"."transaction_modes"
RENAME VALUE 'card' TO 'Card';
--> statement-breakpoint
ALTER TYPE "public"."transaction_modes"
RENAME VALUE 'net banking' TO 'Net Banking';
--> statement-breakpoint
ALTER TYPE "public"."transaction_modes"
RENAME VALUE 'upi' TO 'UPI';
--> statement-breakpoint
ALTER TYPE "public"."transaction_modes"
RENAME VALUE 'other' TO 'Other';
--> statement-breakpoint
ALTER TYPE "public"."transaction_parties"
RENAME VALUE 'driver' TO 'Driver';
--> statement-breakpoint
ALTER TYPE "public"."transaction_parties"
RENAME VALUE 'customer' TO 'Customer';
--> statement-breakpoint
ALTER TYPE "public"."transaction_types"
RENAME VALUE 'debit' TO 'Debit';
--> statement-breakpoint
ALTER TYPE "public"."transaction_types"
RENAME VALUE 'credit' TO 'Credit';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'trip started' TO 'Trip Started';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'trip ended' TO 'Trip Ended';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'arrived' TO 'Arrived';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'picked up' TO 'Picked Up';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'dropped' TO 'Dropped';
--> statement-breakpoint
ALTER TYPE "public"."trip_log_types"
RENAME VALUE 'other' TO 'Other';
--> statement-breakpoint
ALTER TYPE "public"."user_langs"
RENAME VALUE 'en' TO 'English';
--> statement-breakpoint
ALTER TYPE "public"."user_langs"
RENAME VALUE 'hi' TO 'Hindi';
--> statement-breakpoint
ALTER TYPE "public"."user_langs"
RENAME VALUE 'as' TO 'Assamese';
--> statement-breakpoint
ALTER TYPE "public"."user_roles"
RENAME VALUE 'agent' TO 'Agent';
--> statement-breakpoint
ALTER TYPE "public"."user_roles"
RENAME VALUE 'owner' TO 'Owner';
--> statement-breakpoint
ALTER TYPE "public"."user_roles"
RENAME VALUE 'driver' TO 'Driver';
--> statement-breakpoint
ALTER TYPE "public"."user_status"
RENAME VALUE 'new' TO 'New';
--> statement-breakpoint
ALTER TYPE "public"."user_status"
RENAME VALUE 'active' TO 'Active';
--> statement-breakpoint
ALTER TYPE "public"."user_status"
RENAME VALUE 'inactive' TO 'Inactive';
--> statement-breakpoint
ALTER TYPE "public"."user_status"
RENAME VALUE 'suspended' TO 'Suspended';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_status"
RENAME VALUE 'available' TO 'Available';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_status"
RENAME VALUE 'on trip' TO 'On Trip';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_status"
RENAME VALUE 'repair' TO 'Repair';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_status"
RENAME VALUE 'inactive' TO 'Inactive';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_status"
RENAME VALUE 'suspended' TO 'Suspended';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_types"
RENAME VALUE 'car' TO 'Car';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_types"
RENAME VALUE 'bike' TO 'Bike';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_types"
RENAME VALUE 'bus' TO 'Bus';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_types"
RENAME VALUE 'other' TO 'Other';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_types"
RENAME VALUE 'truck' TO 'Truck';