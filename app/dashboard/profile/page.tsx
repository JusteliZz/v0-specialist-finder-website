"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import {
  db,
  serviceCategories,
  predefinedServices,
} from "@/lib/database"
import { Loader2, Save, ArrowLeft, CheckCircle } from "lucide-react"

const lithuanianCities = [
  "Vilnius",
  "Kaunas",
  "Klaipėda",
  "Šiauliai",
  "Panevėžys",
  "Alytus",
  "Marijampolė",
  "Mažeikiai",
  "Jonava",
  "Utena",
]

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    companyCode: "",
    email: "",
    selectedCategories: [] as string[],
    selectedCities: [] as string[],
    selectedServices: [] as string[],
    hourlyRate: 25,
    experience: 1,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load user data
    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      companyName: user.companyName || "",
      companyCode: user.companyCode || "",
      email: user.email || "",
    }))

    // Load specialist profile if user is a specialist
    if (user.role !== "customer") {
      db.specialists.getByUserId(user.id).then((specialistProfile) => {
        if (specialistProfile) {
          setProfile(specialistProfile)
          setFormData((prev) => ({
            ...prev,
            selectedCategories: specialistProfile.categories || [], // Load all categories
            selectedCities: specialistProfile.locations || [], // Load all cities
            selectedServices: specialistProfile.services || [],
            hourlyRate: specialistProfile.hourlyRate || 25,
            experience: specialistProfile.experience || 1,
          }))
        }
      })
    }
  }, [user, router])

  // Get the appropriate categories and services based on user role
  const getServiceCategories = () => {
    return serviceCategories
  }

  const getPredefinedServices = () => {
    return predefinedServices
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }))
  }

  const handleCityToggle = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCities: prev.selectedCities.includes(city)
        ? prev.selectedCities.filter((c) => c !== city)
        : [...prev.selectedCities, city],
    }))
  }

  const handleAllLithuaniaToggle = (checked: boolean) => {
    if (checked) {
      // Select "All Lithuania" - clear all specific cities
      setFormData((prev) => ({ ...prev, selectedCities: [] }))
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Update user basic info
      const userUpdates: any = {
        email: formData.email,
      }

      if (user?.role === "customer" || user?.role === "individual_specialist") {
        userUpdates.firstName = formData.firstName
        userUpdates.lastName = formData.lastName
      } else {
        userUpdates.companyName = formData.companyName
        userUpdates.companyCode = formData.companyCode
      }

      updateUser(userUpdates)

      // Update specialist profile if applicable
      if (user?.role !== "customer" && profile) {
        const services = [...formData.selectedServices]

        await db.specialists.updateProfile(user.id, {
          categories: formData.selectedCategories, // Save all selected categories
          locations: formData.selectedCities, // Save all selected cities (empty array = All Lithuania)
          services: services,
          hourlyRate: formData.hourlyRate,
          experience: formData.experience,
          phone: "", // Remove phone requirement
          description: "", // Remove description requirement
        })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Profile update error:", err)
      setError(t("unexpectedError"))
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("updateProfile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{t("profileUpdatedSuccessfully")}</AlertDescription>
                </Alert>
              )}

              {/* Basic Info */}
              {user.role === "customer" || user.role === "individual_specialist" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">{t("companyName")}</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyCode">{t("companyCode")}</Label>
                    <Input
                      id="companyCode"
                      value={formData.companyCode}
                      onChange={(e) => handleInputChange("companyCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Specialist-specific fields */}
              {user.role !== "customer" && (
                <>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{t("serviceCategories")}</Label>
                    <div className="space-y-3">
                      {serviceCategories.map((category) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`cat-${category}`}
                              checked={formData.selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer">
                              {t(category as any)}
                            </Label>
                          </div>

                          {/* Show services for selected category */}
                          {formData.selectedCategories.includes(category) &&
                            predefinedServices[category as keyof typeof predefinedServices] &&
                            predefinedServices[category as keyof typeof predefinedServices].length > 0 && (
                              <div className="ml-3 p-2 bg-gray-50 rounded border max-w-full">
                                <Label className="text-xs font-medium mb-1 block">
                                  {t("specificServicesIn")} {t(category as any)}:
                                </Label>
                                <div className="grid grid-cols-1 gap-1 max-w-full">
                                  {predefinedServices[category as keyof typeof predefinedServices].map((service) => (
                                    <div key={service} className="flex items-center space-x-2 min-w-0">
                                      <Checkbox
                                        id={`service-${category}-${service}`}
                                        checked={formData.selectedServices.includes(service)}
                                        onCheckedChange={() => handleServiceToggle(service)}
                                        className="flex-shrink-0"
                                      />
                                      <Label
                                        htmlFor={`service-${category}-${service}`}
                                        className="font-normal cursor-pointer text-xs truncate flex-1"
                                      >
                                        {t(service as any)}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{t("cities")}</Label>
                    <div className="space-y-2">
                      {/* All Lithuania option - checked when no cities are selected */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="city-all"
                          checked={formData.selectedCities.length === 0}
                          onCheckedChange={handleAllLithuaniaToggle}
                        />
                        <Label htmlFor="city-all" className="font-medium cursor-pointer">
                          {t("allLithuania")}
                        </Label>
                      </div>

                      {/* Individual cities */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ml-4">
                        {lithuanianCities.map((city) => (
                          <div key={city} className="flex items-center space-x-2">
                            <Checkbox
                              id={`city-${city}`}
                              checked={formData.selectedCities.includes(city)}
                              onCheckedChange={() => handleCityToggle(city)}
                            />
                            <Label htmlFor={`city-${city}`} className="font-normal cursor-pointer text-sm">
                              {city}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">{t("hourlyRate")}</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="1"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", Number.parseInt(e.target.value) || 25)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">{t("experienceYears")}</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("saveChanges")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
