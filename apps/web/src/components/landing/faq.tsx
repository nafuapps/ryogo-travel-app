import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "1",
    question: "How do I book a trip on RyoGo?",
    answer:
      "Booking a trip is simple! Just sign up for an account, search for your destination, select your travel dates, and complete the booking process. Our platform will guide you through each step.",
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, digital wallets (Apple Pay, Google Pay), and bank transfers. All payments are secured with SSL encryption.",
  },
  {
    id: "3",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes! You can cancel or modify your booking through your account dashboard. Standard plans allow one free modification. Premium members get flexible cancellation policies with extended deadlines.",
  },
  {
    id: "4",
    question: "What is the RyoGo rewards program?",
    answer:
      "Earn 1 point for every dollar spent on bookings. Accumulate points to redeem for discounts on future trips, free upgrades, or travel credits. Premium members earn double points!",
  },
  {
    id: "5",
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use bank-level encryption (SSL/TLS) to protect all data. Your information is never shared with third parties without your consent. We comply with all international data protection regulations.",
  },
  {
    id: "6",
    question: "What support options are available?",
    answer:
      "We offer email support for free members, priority email support for Professional members, and 24/7 phone and chat support for Premium members. We're always here to help!",
  },
]

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about RyoGo
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border rounded px-4"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-sky-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
