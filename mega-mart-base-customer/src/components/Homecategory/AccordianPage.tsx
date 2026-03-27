"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const faqData = [
  {
    question: "Why must I make payment immediately at checkout?",
    answer:
      "Immediate payment ensures your order is processed quickly and secures your items in our inventory.",
  },
  {
    question: "Is your website secure?",
    answer:
      "Yes, our website uses SSL encryption and secure payment processing to protect your information.",
  },
  {
    question: "When will my order ship?",
    answer:
      "Orders typically ship within 1-2 business days after payment confirmation.",
  },
  {
    question: "How do I make payments using paypal? How does it work?",
    answer:
      "Select PayPal at checkout, log into your PayPal account, and confirm the payment. It's secure and instant.",
  },
  {
    question: "How much do deliveries cost?",
    answer:
      "Delivery costs vary by location and order size. You'll see exact shipping costs at checkout.",
  },
  {
    question: "How can I contact you?",
    answer:
      "You can reach us through our contact form, email, or phone number listed on our contact page.",
  },
  {
    question: "I forgot my password, how do I reset it?",
    answer:
      "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
  },
  {
    question: "What are the benefits of registering?",
    answer:
      "Registered users enjoy faster checkout, order tracking, exclusive offers, and saved preferences.",
  },
  {
    question: "Can I edit my personal information?",
    answer:
      "Yes, you can edit your personal information in the 'My Account' section by logging in.",
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([8]);
  const [email, setEmail] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="overflow-x-hidden px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 sm:mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-2">
          Our Frequently Asked Questions section is here to give you quick
          answers to the most common queries about our service.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-2 mb-12 sm:mb-16">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-border bg-white rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm sm:text-base font-medium text-foreground pr-4 break-words">
                {item.question}
              </span>
              {openItems.includes(index) ? (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {openItems.includes(index) && (
              <div className="px-4 sm:px-6 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
     <div className="bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-lg space-y-4 mt-12">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-foreground">
                Have any other questions?
              </h2>
              <p className="text-sm text-muted-foreground">
                Don’t hesitate to send us an email with your enquiry or
                statement at
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                placeholder="What's on your mind?"
                className="flex-1  bg-white border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                className="bg-foreground text-background hover:bg-foreground/90 px-6 mt-2 sm:mt-0"
                onClick={() =>
                  toast.success("💬 Message sent! We'll get back to you soon.")
                }
              >
                Send Us
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
