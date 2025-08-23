"use client"

import { Check, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
}

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const { t } = useLanguage()

  const requirements = [
    {
      key: "minLength",
      test: (pwd: string) => pwd.length >= 8,
      message: t("passwordMinLength"),
    },
    {
      key: "hasUppercase",
      test: (pwd: string) => /[A-Z]/.test(pwd),
      message: t("passwordHasUppercase"),
    },
    {
      key: "hasLowercase",
      test: (pwd: string) => /[a-z]/.test(pwd),
      message: t("passwordHasLowercase"),
    },
    {
      key: "hasNumber",
      test: (pwd: string) => /\d/.test(pwd),
      message: t("passwordHasNumber"),
    },
    {
      key: "hasSpecial",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      message: t("passwordHasSpecial"),
    },
  ]

  const passedRequirements = requirements.filter((req) => req.test(password))
  const strength = passedRequirements.length

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500"
    if (strength <= 2) return "bg-orange-500"
    if (strength <= 3) return "bg-yellow-500"
    if (strength <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (strength <= 1) return t("passwordVeryWeak")
    if (strength <= 2) return t("passwordWeak")
    if (strength <= 3) return t("passwordFair")
    if (strength <= 4) return t("passwordGood")
    return t("passwordStrong")
  }

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium">{getStrengthText()}</span>
      </div>

      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req) => {
            const passed = req.test(password)
            return (
              <div key={req.key} className="flex items-center space-x-2 text-sm">
                {passed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-400" />}
                <span className={passed ? "text-green-700" : "text-gray-600"}>{req.message}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function isPasswordStrong(password: string): boolean {
  const requirements = [
    (pwd: string) => pwd.length >= 8,
    (pwd: string) => /[A-Z]/.test(pwd),
    (pwd: string) => /[a-z]/.test(pwd),
    (pwd: string) => /\d/.test(pwd),
    (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  ]

  return requirements.filter((req) => req(password)).length >= 4
}
