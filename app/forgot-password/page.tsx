"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useErrorScroll } from "@/hooks/use-error-scroll"
import { useEnterKey } from "@/hooks/use-enter-key"
import { Loader2, Mail, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const errorRef = useErrorScroll(error)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!email.trim()) {
      setError(t("pleaseEnterEmail"))
      return
    }

    if (!email.includes("@")) {
      setError(t("pleaseEnterValidEmail"))
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (err) {
      setError(t("unexpectedError"))
    } finally {
      setIsLoading(false)
    }
  }

  useEnterKey(() => {
    if (!isLoading && email.trim() && !success) {
      handleSubmit()
    }
  }, [email, isLoading, success])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              InTouch
            </Link>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t("forgotPassword")}</CardTitle>
            <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-green-800">{t("emailSent")}</h3>
                <p className="text-gray-600">{t("checkEmailForInstructions")}</p>
                <Link href="/login">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("backToLogin")}
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" ref={errorRef}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jonas@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  {t("sendResetLink")}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-blue-600 hover:underline">
                    {t("backToLogin")}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
