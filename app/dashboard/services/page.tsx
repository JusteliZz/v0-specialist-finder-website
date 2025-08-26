"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import {
  db,
  serviceCategories,
  predefinedServices,
} from "@/lib/database"
import { ArrowLeft, Plus, Trash2, Save, CheckCircle } from "lucide-react"

export default function ServicesPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [services, setServices] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [customService, setCustomService] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user || user.role === "customer") {
      router.push("/dashboard")
      return
    }

    // Load specialist profile
    db.specialists.getByUserId(user.id).then((specialistProfile) => {
      if (specialistProfile) {
        setProfile(specialistProfile)
        setServices(specialistProfile.services || [])
        setCategory(specialistProfile.categories?.[0] || "")
        setSelectedServices(specialistProfile.services || [])
      }
    })
  }, [user, router])

  // Get the appropriate categories and services based on user role
  const getServiceCategories = () => {
    return serviceCategories
  }

  const getPredefinedServices = () => {
    return predefinedServices
  }

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleAddCustomService = () => {
    if (customService.trim() && !selectedServices.includes(customService.trim())) {
      setSelectedServices((prev) => [...prev, customService.trim()])
      setCustomService("")
    }
  }

  const handleRemoveService = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service))
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setIsLoading(true)
    try {
      await db.specialists.updateProfile(user.id, {
        services: selectedServices,
        categories: category ? [category] : profile.categories,
      })

      setServices(selectedServices)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role === "customer") return null


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
          <h1 className="text-3xl font-bold text-gray-900">{t("manageServices")}</h1>
          <p className="text-gray-600">{t("updateServicesDescription")}</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{t("servicesUpdatedSuccessfully")}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Services */}
          <Card>
            <CardHeader>
              <CardTitle>{t("currentServices")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{service}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(service)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {services.length === 0 && <p className="text-gray-500 text-center py-4">{t("noServicesAdded")}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Add Services */}
          <Card>
            <CardHeader>
              <CardTitle>{t("addServices")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">{t("serviceCategory")}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t(cat as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {category && category !== "Kita" && predefinedServices[category as keyof typeof predefinedServices] && (
                <div>
                  <Label className="text-sm font-medium">{t("availableServices")}</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <Label className="text-xs font-medium mb-2 block">
                      {t("specificServicesIn")} {t(category as any)}:
                    </Label>
                    <div className="space-y-2">
                      {predefinedServices[category as keyof typeof predefinedServices].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service}`}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                            className="flex-shrink-0"
                          />
                          <Label htmlFor={`service-${service}`} className="font-normal cursor-pointer text-sm">
                            {t(service as any)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="customService">{t("customService")}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="customService"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder={t("enterCustomService")}
                  />
                  <Button onClick={handleAddCustomService} disabled={!customService.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" disabled={isLoading || selectedServices.length === 0}>
                {isLoading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t("saveChanges")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Selected Services Preview */}
        {selectedServices.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {t("selectedServices")} ({selectedServices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {service}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
