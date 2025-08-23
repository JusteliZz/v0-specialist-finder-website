"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Check, Crown, Star, Zap, CheckCircle } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  popular?: boolean
  current?: boolean
}

export default function SubscriptionPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [currentPlan, setCurrentPlan] = useState<string>("free")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load current subscription from localStorage or API
    const savedPlan = localStorage.getItem(`subscription_${user.id}`)
    if (savedPlan) {
      setCurrentPlan(savedPlan)
    }
  }, [user, router])

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: t("freePlan"),
      price: 0,
      period: t("forever"),
      features: [t("basicProfileListing"), t("receiveInquiries"), t("emailSupport"), t("basicAnalytics")],
      current: currentPlan === "free",
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
      current: currentPlan === "professional",
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
      current: currentPlan === "business",
    },
  ]

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return

    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save new plan
      localStorage.setItem(`subscription_${user.id}`, planId)
      setCurrentPlan(planId)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error upgrading subscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("back")}
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">InTouch</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("subscriptionPlans")}</h1>
          <p className="text-xl text-gray-600">{t("chooseThePlanThatFitsYourNeeds")}</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{t("subscriptionUpdatedSuccessfully")}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""} ${plan.current ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    {t("mostPopular")}
                  </Badge>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    {t("current")}
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

                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.current || isLoading}
                >
                  {plan.current ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("currentPlan")}
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      {plan.id === "free" ? t("downgrade") : t("upgrade")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Plan Details */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t("currentSubscription")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("planName")}</h4>
                <p className="text-gray-600">{plans.find((p) => p.id === currentPlan)?.name}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("monthlyPrice")}</h4>
                <p className="text-gray-600">€{plans.find((p) => p.id === currentPlan)?.price || 0}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t("nextBilling")}</h4>
                <p className="text-gray-600">
                  {currentPlan === "free"
                    ? t("noNextBilling")
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8">
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
