"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Send, Clock, Search, Zap } from "lucide-react"

export default function HomePage() {
  const { t, language = 'en' } = useLanguage()
  const { user } = useAuth()

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
                <Button
                  variant="outline"
                  size="lg"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl"
                >
                  {t("joinAsSpecialist")}
                </Button>
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

      {/* Subscription Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "lt" ? "Pasirinkite savo planą" : "Choose Your Plan"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "lt" 
                ? "Pradėkite nemokamai arba pasirinkite planą, kuris atitinka jūsų poreikius"
                : "Start for free or choose a plan that fits your needs"
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "lt" ? "Nemokamas" : "Free"}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">€0</div>
                <div className="text-gray-600">
                  {language === "lt" ? "visam laikui" : "forever"}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Pagrindinis profilio sąrašas" : "Basic profile listing"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Gauti užklausas" : "Receive inquiries"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "El. pašto pagalba" : "Email support"}
                  </span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3">
                  {language === "lt" ? "Pradėti nemokamai" : "Start Free"}
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-blue-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {language === "lt" ? "Populiariausias" : "Most Popular"}
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "lt" ? "Profesionalus" : "Professional"}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">€19</div>
                <div className="text-gray-600">
                  {language === "lt" ? "per mėnesį" : "per month"}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Prioritetinis sąrašas" : "Priority listing"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Neribotai užklausų" : "Unlimited inquiries"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Išplėstinė analitika" : "Advanced analytics"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Prioritetinė pagalba" : "Priority support"}
                  </span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                {language === "lt" ? "Pasirinkti planą" : "Choose Plan"}
              </Button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "lt" ? "Verslo" : "Business"}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">€49</div>
                <div className="text-gray-600">
                  {language === "lt" ? "per mėnesį" : "per month"}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Keli komandos nariai" : "Multiple team members"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Išplėstinės ataskaitos" : "Advanced reporting"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "API prieiga" : "API access"}
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">
                    {language === "lt" ? "Paskirtoji pagalba" : "Dedicated support"}
                  </span>
                </li>
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3">
                {language === "lt" ? "Pasirinkti planą" : "Choose Plan"}
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard/subscription">
              <Button variant="outline" size="lg" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                {language === "lt" ? "Peržiūrėti visus planus" : "View All Plans"}
              </Button>
            </Link>
          </div>
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
