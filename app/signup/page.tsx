"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { PasswordStrength, isPasswordStrong } from "@/components/password-strength"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useErrorScroll } from "@/hooks/use-error-scroll"
import { useEnterKey } from "@/hooks/use-enter-key"
import { db } from "@/lib/database"
import { Loader2, AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t, language } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const errorRef = useErrorScroll(error)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
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

      // Create new customer user
      const userData = {
        email: formData.email,
        password: formData.password,
        role: "customer" as const,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }

      const newUser = await db.users.create(userData)

      // Log the user in
      login(newUser)

      // Redirect to specialists page for customers
      router.push("/specialists")
    } catch (err) {
      console.error("Signup error:", err)
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
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-3xl font-bold text-center">{t("signup")}</CardTitle>
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

                <Button type="submit" className="w-full p-6 text-lg bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("createAccount")}
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
