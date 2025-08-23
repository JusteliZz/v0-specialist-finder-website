"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Mail, Users, BarChart3, Eye, LogOut, Settings, Briefcase, CheckCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === "customer") {
      router.replace("/specialists")
    }
  }, [user, router])

  if (!user || user.role === "customer") {
    return null // Render nothing while redirecting
  }

  // Business specialist dashboard - now similar to individual specialist
  if (user.role === "business_specialist") {
    const stats = [
      { title: t("inquiriesReceived"), value: "12", icon: <Mail className="h-7 w-7 text-blue-600" /> },
      { title: t("responseRate"), value: "89%", icon: <BarChart3 className="h-7 w-7 text-green-600" /> },
      { title: t("profileViews"), value: "156", icon: <Eye className="h-7 w-7 text-purple-600" /> },
      { title: t("activeProjects"), value: "4", icon: <Briefcase className="h-7 w-7 text-orange-600" /> },
    ]

    const quickActions = [
      { title: t("searchOfferServices"), icon: <Users />, href: "/specialists" },
      { title: t("manageProfile"), icon: <Settings />, href: "/dashboard/profile" },
      { title: t("viewInquiries"), icon: <Mail />, href: "/dashboard/inquiries" },
    ]

    const latestActivity = [
      {
        type: "inquiry",
        title: t("newInquiry"),
        description: 'UAB "Statybos projektai" pateikė užklausą dėl biuro renovacijos',
        time: "2 hours ago",
        icon: <Mail className="h-5 w-5 text-blue-500" />,
      },
      {
        type: "response",
        title: t("responseNeeded"),
        description: "Privatus klientas laukia atsakymo dėl vonios remonto",
        time: "5 hours ago",
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      },
      {
        type: "completed",
        title: t("projectCompleted"),
        description: "Sėkmingai užbaigtas virtuvės įrengimo projektas",
        time: "1 day ago",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      },
    ]

    const handleLogout = () => {
      logout()
      router.push("/")
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="text-3xl font-bold text-blue-600">
                InTouch
              </Link>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  <LogOut className="h-5 w-5 mr-2" />
                  {t("logout")}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("welcome")}, {user.companyName || "verslo specialiste"}!
            </h1>
            <p className="text-gray-600">{t("dashboardOverview")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm bg-white">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">{t("quickActions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {/* First action - full width */}
                  <Link href={quickActions[0].href} key={quickActions[0].title}>
                    <div className="p-4 border rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-4 transition-colors">
                      <div className="text-blue-600">{quickActions[0].icon}</div>
                      <span className="font-semibold">{quickActions[0].title}</span>
                    </div>
                  </Link>

                  {/* Remaining actions - 2 column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.slice(1).map((action) => (
                      <Link href={action.href} key={action.title}>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 flex items-center space-x-4 transition-colors">
                          <div className="text-blue-600">{action.icon}</div>
                          <span className="font-semibold">{action.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Activity */}
            <div>
              <Card className="shadow-sm bg-white">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">{t("latestActivity")}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {latestActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {activity.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Individual specialist dashboard
  const stats = [
    { title: t("sentMessages"), value: "34", icon: <Mail className="h-7 w-7 text-blue-600" /> },
    { title: t("activeContacts"), value: "55", icon: <Users className="h-7 w-7 text-green-600" /> },
    { title: t("replyRate"), value: "72%", icon: <BarChart3 className="h-7 w-7 text-purple-600" /> },
    { title: t("unread"), value: "5", icon: <Mail className="h-7 w-7 text-red-600" /> },
  ]

  const quickActions = [
    { title: t("searchOfferServices"), icon: <Users />, href: "/specialists" },
    { title: t("manageProfile"), icon: <Settings />, href: "/dashboard/profile" },
    { title: t("subscription"), icon: <Briefcase />, href: "/dashboard/subscription" },
  ]

  const latestActivity = [
    {
      type: "reply",
      title: t("newReply"),
      description: 'UAB "Tech Solutions" atsakė į jūsų užklausą',
      time: "5 min ago",
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      type: "contact",
      title: t("newContact"),
      description: "Jonas Jonaitis prisijungė prie jūsų tinklo",
      time: "2 hours ago",
      icon: <Users className="h-5 w-5 text-green-500" />,
    },
    {
      type: "system",
      title: t("system"),
      description: "Sėkmingai atnaujinta prenumerata",
      time: "1 day ago",
      icon: <Settings className="h-5 w-5 text-purple-500" />,
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              InTouch
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                <LogOut className="h-5 w-5 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("welcome")}, {user.firstName || "specialiste"}!
          </h1>
          <p className="text-gray-600">{t("dashboardOverview")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">{t("quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* First action - full width */}
                <Link href={quickActions[0].href} key={quickActions[0].title}>
                  <div className="p-4 border rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-4 transition-colors">
                    <div className="text-blue-600">{quickActions[0].icon}</div>
                    <span className="font-semibold">{quickActions[0].title}</span>
                  </div>
                </Link>

                {/* Remaining actions - 2 column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.slice(1).map((action) => (
                    <Link href={action.href} key={action.title}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 flex items-center space-x-4 transition-colors">
                        <div className="text-blue-600">{action.icon}</div>
                        <span className="font-semibold">{action.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Activity */}
          <div>
            <Card className="shadow-sm bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">{t("latestActivity")}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {latestActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
