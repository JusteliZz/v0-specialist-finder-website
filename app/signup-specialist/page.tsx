"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { PasswordStrength, isPasswordStrong } from "@/components/password-strength"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useErrorScroll } from "@/hooks/use-error-scroll"
import { useEnterKey } from "@/hooks/use-enter-key"
import { db, serviceCategories, predefinedServices } from "@/lib/database"
import { Loader2, AlertCircle } from "lucide-react"

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

const professionsList = [
  "Santechnikas",
  "Elektrikas", 
  "Programuotojas",
  "Dizaineris",
  "Fotografas",
  "Buhalteris",
  "Teisininkas",
  "Architekturas",
  "Inžinierius",
  "Mokytojas",
  "Treneris",
  "Masažuotojas",
  "Kirpėjas",
  "Kosmetologas",
  "Vertėjas",
  "Konsultantas",
  "Remontuotojas",
  "Valytojas",
  "Vairuotojas",
  "Kita"
]

export default function SpecialistSignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    selectedCategories: [] as string[],
    selectedCities: [] as string[],
    selectedServices: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const errorRef = useErrorScroll(error)

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
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

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError(t("pleaseEnterEmail"))
      return false
    }

    if (!formData.email.includes("@")) {
      setError(t("pleaseEnterValidEmail"))
      return false
    }

    if (!formData.password) {
      setError(t("pleaseEnterPassword"))
      return false
    }

    if (!isPasswordStrong(formData.password)) {
      setError(t("passwordTooWeak"))
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatchError"))
      return false
    }

    if (!formData.firstName.trim()) {
      setError(t("pleaseEnterFirstName"))
      return false
    }

    if (!formData.lastName.trim()) {
      setError(t("pleaseEnterLastName"))
      return false
    }


    if (formData.selectedCategories.length === 0) {
      setError(t("pleaseSelectCategory"))
      return false
    }

    if (formData.selectedServices.length === 0) {
      setError(t("pleaseSelectServices"))
      return false
    }

    return true
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Check if user already exists
      const existingUser = await db.users.findByEmail(formData.email)
      if (existingUser) {
        setError(t("userExistsError"))
        setIsLoading(false)
        return
      }

      // Create new specialist user
      const userData = {
        email: formData.email,
        password: formData.password,
        role: "individual_specialist" as const,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }

      const newUser = await db.users.create(userData)

      // Create specialist profile
      await db.specialists.createProfile({
        userId: newUser.id,
        type: "individual",
      profession: formData.selectedCategories[0] || "Specialistas", // Use first category as profession
        categories: formData.selectedCategories,
        locations: formData.selectedCities,
        phone: "",
        description: "",
        services: formData.selectedServices,
      })

      // Log the user in
      login(newUser)

      // Redirect to dashboard for specialists
      router.push("/dashboard")
    } catch (err) {
      console.error("Specialist signup error:", err)
      setError(t("unexpectedError"))
      setIsLoading(false)
    }
  }

  useEnterKey(() => {
    if (!isLoading) {
      handleSubmit()
    }
  }, [isLoading, formData])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              InTouch
            </Link>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  {t("login")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-3xl font-bold text-center">
                Registracija specialistams
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" ref={errorRef}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("error")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {formData.password && <PasswordStrength password={formData.password} />}

                {/* Service Categories */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">{t("serviceCategories")}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <div className="ml-3 p-2 bg-blue-50 rounded border">
                              <Label className="text-xs font-medium mb-1 block">
                                {t("specificServicesIn")} {t(category as any)}:
                              </Label>
                              <div className="grid grid-cols-1 gap-1">
                                {predefinedServices[category as keyof typeof predefinedServices].map((service) => (
                                  <div key={service} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`service-${category}-${service}`}
                                      checked={formData.selectedServices.includes(service)}
                                      onCheckedChange={() => handleServiceToggle(service)}
                                      className="flex-shrink-0"
                                    />
                                    <Label
                                      htmlFor={`service-${category}-${service}`}
                                      className="font-normal cursor-pointer text-xs"
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

                {/* Cities */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">{t("cities")}</Label>
                  <div className="space-y-2">
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

                <Button 
                  type="submit" 
                  className="w-full p-6 text-lg bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Sukurti specialisto paskyrą"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-gray-600">
                  {t("alreadyHaveAccount")}{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                    {t("signInLink")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}