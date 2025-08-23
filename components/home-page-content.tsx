"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, Mail, Star, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HomePageContent() {
  const { t } = useLanguage()

  return (
    <>
      {/* Header Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost">{t("login")}</Button>
        </Link>
        <Link href="/signup">
          <Button>{t("signup")}</Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("heroTitle")}
            <span className="text-indigo-600">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("heroDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/specialists">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                {t("findSpecialists")}
              </Button>
            </Link>
            <Link href="/join-as-specialist">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Users className="mr-2 h-5 w-5" />
                {t("joinAsSpecialist")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("whyChooseTitle")}</h2>
            <p className="text-lg text-gray-600">{t("whyChooseSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>{t("easySearchTitle")}</CardTitle>
                <CardDescription>{t("easySearchDesc")}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Mail className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>{t("directCommTitle")}</CardTitle>
                <CardDescription>{t("directCommDesc")}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>{t("verifiedProfTitle")}</CardTitle>
                <CardDescription>{t("verifiedProfDesc")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("readyToStart")}</h2>
          <p className="text-xl text-indigo-100 mb-8">{t("joinThousands")}</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              {t("getStartedToday")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">InTouch</h3>
              <p className="text-gray-400">{t("footerDescription")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("forCustomers")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/specialists" className="hover:text-white">
                    {t("findSpecialistsLink")}
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    {t("howItWorks")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("forProfessionals")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/join-as-specialist" className="hover:text-white">
                    {t("joinAsSpecialistLink")}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    {t("pricing")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("support")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    {t("contactUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    {t("helpCenter")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InTouch. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
