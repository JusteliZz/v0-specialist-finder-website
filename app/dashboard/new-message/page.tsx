"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { db, serviceCategories, predefinedServices, type FullSpecialistProfile } from "@/lib/database"
import { ArrowLeft, Send, Mail, CheckCircle } from "lucide-react"

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

export default function NewMessagePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [allSpecialists, setAllSpecialists] = useState<FullSpecialistProfile[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [specialistType, setSpecialistType] = useState<"all" | "individual" | "business">("all")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    db.specialists.getAll().then(setAllSpecialists)
  }, [user, router])

  const filteredSpecialists = allSpecialists.filter((specialist) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(specialist.category)
    const typeMatch = specialistType === "all" || specialist.type === specialistType
    const cityMatch = selectedCities.length === 0 || selectedCities.includes(specialist.location)
    return categoryMatch && typeMatch && cityMatch
  })

  useEffect(() => {
    setSelectedEmails(filteredSpecialists.map((s) => s.email).filter(Boolean) as string[])
  }, [filteredSpecialists])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) => {
      const newCities = new Set(prev)
      if (newCities.has(city)) {
        newCities.delete(city)
      } else {
        newCities.add(city)
      }
      return Array.from(newCities)
    })
  }

  const handleEmailSelectionToggle = (email: string) => {
    setSelectedEmails((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]))
  }

  const handleSelectAllEmails = (select: boolean) => {
    if (select) {
      setSelectedEmails(filteredSpecialists.map((s) => s.email).filter(Boolean) as string[])
    } else {
      setSelectedEmails([])
    }
  }

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim() || selectedEmails.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      // Create mailto link
      const to = selectedEmails.join(";")
      const mailtoLink = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

      // Open email client
      window.open(mailtoLink, "_blank")

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
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

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t("newMessage")}</h1>
          <p className="text-gray-600">{t("composeNewMessage")}</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{t("messageOpenedInEmailClient")}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t("filters")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("serviceCategories")}</Label>
                  <div className="space-y-2">
                    {serviceCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer text-sm">
                          {t(category as any)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("specialistType")}</Label>
                  <RadioGroup
                    value={specialistType}
                    onValueChange={(v) => setSpecialistType(v as any)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all" />
                      <Label htmlFor="type-all" className="font-normal text-sm">
                        {t("allTypes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="type-individual" />
                      <Label htmlFor="type-individual" className="font-normal text-sm">
                        {t("individualSpecialist")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="type-business" />
                      <Label htmlFor="type-business" className="font-normal text-sm">
                        {t("businessSpecialist")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("cities")}</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="city-all"
                        checked={selectedCities.length === 0}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedCities([])
                        }}
                      />
                      <Label htmlFor="city-all" className="font-normal cursor-pointer text-sm">
                        {t("allLithuania")}
                      </Label>
                    </div>
                    {lithuanianCities.map((city) => (
                      <div key={city} className="flex items-center space-x-2">
                        <Checkbox
                          id={`city-${city}`}
                          checked={selectedCities.includes(city)}
                          onCheckedChange={() => handleCityToggle(city)}
                        />
                        <Label htmlFor={`city-${city}`} className="font-normal cursor-pointer text-sm">
                          {city}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Composition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipients */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {t("recipients")} ({filteredSpecialists.length})
                  </CardTitle>
                  {filteredSpecialists.length > 0 && (
                    <div className="space-x-2">
                      <Button variant="link" size="sm" onClick={() => handleSelectAllEmails(true)}>
                        {t("selectAll")}
                      </Button>
                      <Button variant="link" size="sm" onClick={() => handleSelectAllEmails(false)}>
                        {t("deselectAll")}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {filteredSpecialists.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {filteredSpecialists.map((specialist) => (
                      <div key={specialist.userId} className="flex items-start space-x-3">
                        <Checkbox
                          id={`email-${specialist.userId}`}
                          checked={selectedEmails.includes(specialist.email!)}
                          onCheckedChange={() => handleEmailSelectionToggle(specialist.email!)}
                          className="mt-1"
                        />
                        <Label htmlFor={`email-${specialist.userId}`} className="font-normal cursor-pointer flex-grow">
                          <span className="block font-medium text-sm truncate">
                            {specialist.type === "business"
                              ? specialist.companyName
                              : `${specialist.firstName} ${specialist.lastName}`}
                          </span>
                          <span className="block text-xs text-gray-500 truncate">{specialist.email}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="font-semibold">{t("noSpecialistsFound")}</p>
                    <p className="text-sm text-gray-600">{t("adjustFiltersToFindSpecialists")}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t("composeMessage")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">{t("subject")}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("enterSubject")}
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("typeYourMessage")}
                    rows={8}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  className="w-full"
                  disabled={!subject.trim() || !message.trim() || selectedEmails.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Mail className="h-4 w-4 mr-2 animate-spin" />
                      {t("opening")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("sendMessage")} ({selectedEmails.length})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
