import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    id: 1,
    name: "Starter",
    description: "Perfect for occasional travelers",
    price: "Free",
    period: "",
    features: [
      "Up to 5 bookings per year",
      "Basic support via email",
      "View trip history",
      "Standard pricing",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: 2,
    name: "Professional",
    description: "For frequent travelers",
    price: "$9.99",
    period: "/month",
    features: [
      "Unlimited bookings",
      "Priority email support",
      "Early access to deals",
      "Discounted pricing (5% off)",
      "Travel insurance options",
      "Exclusive member events",
    ],
    cta: "Choose Plan",
    highlighted: true,
  },
  {
    id: 3,
    name: "Premium",
    description: "For business and frequent travelers",
    price: "$24.99",
    period: "/month",
    features: [
      "Everything in Professional",
      "24/7 VIP support",
      "Concierge service",
      "Extra discounts (10% off)",
      "Flexible cancellation policy",
      "Dedicated account manager",
      "Corporate travel management",
    ],
    cta: "Choose Plan",
    highlighted: false,
  },
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your travel needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col relative ${
                plan.highlighted ? "md:scale-105 border-sky-500 border-2" : ""
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-sky-600 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
