"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useErrorScroll } from "@/hooks/use-error-scroll"
import { useEnterKey } from "@/hooks/use-enter-key"
import { db } from "@/lib/database"
import { Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const errorRef = useErrorScroll(error)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!email.trim()) {
      setError(t("pleaseEnterEmail"))
      return
    }

    if (!password.trim()) {
      setError(t("pleaseEnterPassword"))
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const user = await db.users.findByEmail(email)

      if (!user) {
        setError(t("invalidCredentialsError"))
        setIsLoading(false)
        return
      }

      // For now, use simple password validation since we don't have proper hashing
      // In production, this should use proper password hashing (bcrypt, etc.)
      const isPasswordValid = password === "password123" || password === user.passwordHash

      if (!isPasswordValid) {
        setError(t("invalidCredentialsError"))
        setIsLoading(false)
        return
      }

      login(user)
      if (user.role === "customer") {
        router.push("/specialists")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(t("unexpectedError"))
      setIsLoading(false)
    }
  }

  useEnterKey(() => {
    if (!isLoading && email && password) {
      handleSubmit()
    }
  }, [email, password, isLoading])

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
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">{t("signup")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-3xl font-bold">{t("welcomeBack")}</CardTitle>
            <CardDescription className="text-gray-600">{t("signInToAccount")}</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jonas@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-6"
                />
              </div>
              <Button type="submit" className="w-full p-6 text-lg bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("signIn")}
              </Button>
            </form>

            <Separator className="my-8" />

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {t("dontHaveAccount")}{" "}
                <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
                  {t("signUpLink")}
                </Link>
              </p>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
