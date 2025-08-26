"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { Check, Crown, Star, Zap } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  popular?: boolean
}

export default function SubscriptionPage() {
  const { t } = useLanguage()

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: t("freePlan"),
      price: 0,
      period: t("forever"),
      features: [t("basicProfileListing"), t("receiveInquiries"), t("emailSupport"), t("basicAnalytics")],
    },
    {
      id: "professional",
      name: t("professionalPlan"),
      price: 19.99,
      period: t("perMonth"),
      features: [
        t("priorityListing"),
        t("unlimitedInquiries"),
        t("advancedAnalytics"),
        t("customBranding"),
        t("prioritySupport"),
        t("portfolioGallery"),
      ],
      popular: true,
    },
    {
      id: "business",
      name: t("businessPlan"),
      price: 49.99,
      period: t("perMonth"),
      features: [
        t("multipleTeamMembers"),
        t("advancedReporting"),
        t("apiAccess"),
        t("whiteLabeling"),
        t("dedicatedSupport"),
        t("customIntegrations"),
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              InTouch
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link href="/signup">
                <Button>{t("signup")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("subscriptionPlans")}</h1>
          <p className="text-xl text-gray-600">{t("chooseThePlanThatFitsYourNeeds")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    {t("mostPopular")}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {t("getStartedToday")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t("frequentlyAskedQuestions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("canIChangeMyPlanAnytime")}</h4>
                <p className="text-gray-600">{t("canIChangeMyPlanAnytimeAnswer")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("whatPaymentMethodsAccepted")}</h4>
                <p className="text-gray-600">{t("whatPaymentMethodsAcceptedAnswer")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("isThereAFreeTrial")}</h4>
                <p className="text-gray-600">{t("isThereAFreeTrialAnswer")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}