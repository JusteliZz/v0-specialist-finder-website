"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Save, CheckCircle, Bell, Shield, Globe } from "lucide-react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    profileVisibility: "public",
    autoRespond: false,
    autoRespondMessage: "",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    timezone: "Europe/Vilnius",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem(`settings_${user.id}`)
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [user, router])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleWorkingHoursChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Save to localStorage (in real app, save to API)
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
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

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>
          <p className="text-gray-600">{t("manageAccountSettings")}</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{t("settingsSavedSuccessfully")}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                {t("languageSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">{t("preferredLanguage")}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lt">🇱🇹 Lietuvių</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {t("notificationSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">{t("emailNotifications")}</Label>
                    <p className="text-sm text-gray-600">{t("receiveEmailNotifications")}</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">{t("smsNotifications")}</Label>
                    <p className="text-sm text-gray-600">{t("receiveSmsNotifications")}</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">{t("marketingEmails")}</Label>
                    <p className="text-sm text-gray-600">{t("receiveMarketingEmails")}</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {t("privacySettings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">{t("profileVisibility")}</Label>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t("public")}</SelectItem>
                      <SelectItem value="private">{t("private")}</SelectItem>
                      <SelectItem value="contacts">{t("contactsOnly")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">{t("profileVisibilityDescription")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Settings (for specialists) */}
          {user.role !== "customer" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("businessSettings")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRespond">{t("autoRespond")}</Label>
                      <p className="text-sm text-gray-600">{t("autoRespondDescription")}</p>
                    </div>
                    <Switch
                      id="autoRespond"
                      checked={settings.autoRespond}
                      onCheckedChange={(checked) => handleSettingChange("autoRespond", checked)}
                    />
                  </div>

                  {settings.autoRespond && (
                    <div>
                      <Label htmlFor="autoRespondMessage">{t("autoRespondMessage")}</Label>
                      <Input
                        id="autoRespondMessage"
                        value={settings.autoRespondMessage}
                        onChange={(e) => handleSettingChange("autoRespondMessage", e.target.value)}
                        placeholder={t("autoRespondPlaceholder")}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workingHoursStart">{t("workingHoursStart")}</Label>
                      <Input
                        id="workingHoursStart"
                        type="time"
                        value={settings.workingHours.start}
                        onChange={(e) => handleWorkingHoursChange("start", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workingHoursEnd">{t("workingHoursEnd")}</Label>
                      <Input
                        id="workingHoursEnd"
                        type="time"
                        value={settings.workingHours.end}
                        onChange={(e) => handleWorkingHoursChange("end", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone">{t("timezone")}</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Vilnius">Europe/Vilnius (GMT+2)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                        <SelectItem value="Europe/Berlin">Europe/Berlin (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t("saveSettings")}
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
