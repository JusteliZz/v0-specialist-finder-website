"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Send, Clock, Search, Zap } from "lucide-react"

export default function HomePage() {
  const { t, language = 'en' } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  // Redirect logged-in users to appropriate page
  useEffect(() => {
    if (user) {
      if (user.role === "customer") {
        router.push("/specialists")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  // Don't render the page if user is logged in (will redirect)
  if (user) {
    return null
  }

  const howItWorksSteps = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: t("howItWorksStep1Title"),
      description: t("howItWorksStep1Desc"),
    },
    {
      icon: <Send className="h-8 w-8 text-green-600" />,
      title: t("howItWorksStep2Title"),
      description: t("howItWorksStep2Desc"),
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: t("howItWorksStep3Title"),
      description: t("howItWorksStep3Desc"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-3xl font-bold text-blue-600">
                InTouch
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              {user ? (
                <Link href={user.role === "customer" ? "/specialists" : "/dashboard"}>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    {t("dashboard")}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">{t("signup")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t("heroTitleV2_1")}
              <span className="text-blue-600 block">{t("heroTitleV2_2")}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">{t("heroDescriptionV2")}</p>
            <div className="flex justify-center">
              <Link href={user ? (user.role === "customer" ? "/specialists" : "/dashboard") : "/signup"}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Search className="mr-3 h-6 w-6" />
                  {t("startConnecting")}
                </Button>
              </Link>
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/signup-specialist">
                <span className="text-blue-600 hover:text-blue-800 text-lg font-medium underline cursor-pointer">
                  {t("joinAsSpecialist")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("howItWorksTitle")}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-8 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Simple Subscription Buttons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === "lt" ? "Pasiruošę pradėti?" : "Ready to get started?"}
          </h2>
          <p className="text-lg text-blue-600 mb-10 font-medium">
            {language === "lt" 
              ? "Prisijunkite prie tūkstančių patenkintų klientų ir specialistų" 
              : "Join thousands of satisfied customers and specialists"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {language === "lt" ? "Pradėti nemokamai" : "Start Free"}
              </Button>
            </Link>
            <Link href="/subscription">
              <Button
                size="lg"
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 text-lg px-10 py-4 rounded-lg font-semibold transition-all duration-200"
              >
                {language === "lt" ? "Peržiūrėti prenumeratos planus" : "View subscription plans"}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            {language === "lt" 
              ? "Kredito kortelė nereikalinga • Registracija bet kada" 
              : "No credit card required • Register anytime"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2025 InTouch. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
