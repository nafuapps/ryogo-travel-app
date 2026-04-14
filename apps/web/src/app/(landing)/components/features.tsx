import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    id: 1,
    title: "Easy Booking",
    description:
      "Book your trips in just a few clicks with our intuitive interface",
    icon: "✈️",
  },
  {
    id: 2,
    title: "Real-time Tracking",
    description:
      "Track your bookings and trips in real-time from your dashboard",
    icon: "📍",
  },
  {
    id: 3,
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security encryption",
    icon: "🔒",
  },
  {
    id: 4,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support to help you with any questions",
    icon: "💬",
  },
  {
    id: 5,
    title: "Best Prices",
    description: "Get the best deals on flights, hotels, and travel packages",
    icon: "💰",
  },
  {
    id: 6,
    title: "Travel Rewards",
    description: "Earn points on every booking and redeem them for discounts",
    icon: "⭐",
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose RyoGo?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer the best features to make your travel experience smooth and
            enjoyable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
