"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { UnimplementedNotice } from "@/components/unimplemented-notice"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useErrorScroll } from "@/hooks/use-error-scroll"
import { useEnterKey } from "@/hooks/use-enter-key"
import { db, serviceCategories, predefinedServices, type FullSpecialistProfile } from "@/lib/database"
import { LogOut, Mail, AlertCircle, Search } from "lucide-react"

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

export default function SpecialistsPage() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [allSpecialists, setAllSpecialists] = useState<FullSpecialistProfile[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [specialistType, setSpecialistType] = useState<"individual" | "business">("individual")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [mailtoLink, setMailtoLink] = useState("")
  const [error, setError] = useState("")
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({})
  const [specialistsToShow, setSpecialistsToShow] = useState(6)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const SPECIALISTS_PER_PAGE = 6
  const errorRef = useErrorScroll(error)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Redirect to home page if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      db.specialists
        .getAll()
        .then(setAllSpecialists)
        .catch((error) => {
          console.error("Error fetching specialists:", error)
          setError(t("errorFetchingSpecialists"))
        })
    }
  }, [user, t])

  // Get search suggestions based on current search term
  const searchSuggestions = useMemo(() => {
    if (searchTerm.length < 2) return []

    const suggestions = allSpecialists
      .filter((specialist) => {
        const fullName =
          specialist.type === "business"
            ? specialist.companyName?.toLowerCase() || ""
            : `${specialist.firstName} ${specialist.lastName}`.toLowerCase()
        const email = specialist.email?.toLowerCase() || ""
        const profession = specialist.profession?.toLowerCase() || ""
        const searchLower = searchTerm.toLowerCase()

        return fullName.includes(searchLower) || email.includes(searchLower) || profession.includes(searchLower)
      })
      .slice(0, 5) // Limit to 5 suggestions
      .map((specialist) => ({
        id: specialist.userId,
        name:
          specialist.type === "business"
            ? specialist.companyName || ""
            : `${specialist.firstName} ${specialist.lastName}`,
        email: specialist.email || "",
        profession: specialist.profession,
        isSelected: selectedEmails.includes(specialist.email || ""),
      }))

    return suggestions
  }, [allSpecialists, searchTerm, selectedEmails])


  const filteredSpecialists = useMemo(() => {
    return allSpecialists.filter((specialist) => {
      // Search term match
      let searchMatch = true
      if (searchTerm.trim()) {
        const fullName =
          specialist.type === "business"
            ? specialist.companyName?.toLowerCase() || ""
            : `${specialist.firstName} ${specialist.lastName}`.toLowerCase()
        const email = specialist.email?.toLowerCase() || ""
        const profession = specialist.profession?.toLowerCase() || ""
        const searchLower = searchTerm.toLowerCase()

        searchMatch = fullName.includes(searchLower) || email.includes(searchLower) || profession.includes(searchLower)
      }

      // Category match: if no categories selected OR any specialist category matches any selected category
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((selectedCat) => specialist.categories.includes(selectedCat))

      const typeMatch = specialist.type === specialistType

      // City match: if no cities selected OR any specialist location matches any selected city OR specialist works in all Lithuania
      const cityMatch =
        selectedCities.length === 0 ||
        specialist.locations.length === 0 || // Specialist works in All Lithuania
        selectedCities.some((selectedCity) => specialist.locations.includes(selectedCity))

      // Service-specific filtering
      let serviceMatch = true
      if (selectedCategories.length > 0) {
        const categoryHasSelectedServices = selectedCategories.some(
          (cat) => selectedServices[cat] && selectedServices[cat].length > 0,
        )

        if (categoryHasSelectedServices) {
          // Check if specialist has any of the selected categories AND any of the selected services
          const hasMatchingCategory = selectedCategories.some((cat) => specialist.categories.includes(cat))
          if (hasMatchingCategory) {
            const relevantServices = selectedCategories
              .filter((cat) => specialist.categories.includes(cat))
              .flatMap((cat) => selectedServices[cat] || [])

            if (relevantServices.length > 0) {
              serviceMatch = relevantServices.some((service) => specialist.services.includes(service))
            }
          }
        }
      }

      return searchMatch && categoryMatch && typeMatch && cityMatch && serviceMatch
    })
  }, [allSpecialists, searchTerm, selectedCategories, specialistType, selectedCities, selectedServices])

  useEffect(() => {
    // Auto-select all filtered specialists when data loads or filters change, but not during search
    if (filteredSpecialists.length > 0 && searchTerm.trim() === '') {
      const allFilteredEmails = filteredSpecialists.map((s) => s.email).filter(Boolean) as string[]
      setSelectedEmails(allFilteredEmails)
    }
  }, [filteredSpecialists, searchTerm])

  useEffect(() => {
    if (selectedEmails.length > 0 && message.trim()) {
      const to = selectedEmails.join(";")
      const subject = t("inquiryFromInTouch")
      const body = message

      const link = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setMailtoLink(link)
    } else {
      setMailtoLink("")
    }
  }, [selectedEmails, message, t])

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(value.length >= 2)
    setSelectedSuggestionIndex(-1)
  }

  // Handle search input key events
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev < searchSuggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : searchSuggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          const suggestion = searchSuggestions[selectedSuggestionIndex]
          handleSuggestionToggle(suggestion)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  // Handle suggestion toggle (select/deselect)
  const handleSuggestionToggle = (suggestion: (typeof searchSuggestions)[0]) => {
    if (suggestion.isSelected) {
      // Deselect the specialist
      setSelectedEmails((prev) => prev.filter((email) => email !== suggestion.email))
    } else {
      // Select the specialist
      setSelectedEmails((prev) => [...prev, suggestion.email])
    }
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.focus()
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: (typeof searchSuggestions)[0]) => {
    handleSuggestionToggle(suggestion)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
    const filteredEmails = filteredSpecialists.map((s) => s.email).filter(Boolean) as string[]

    if (select) {
      // Add all filtered emails to selection (preserve existing selections from other filters)
      setSelectedEmails((prev) => {
        const newEmails = [...prev]
        filteredEmails.forEach((email) => {
          if (!newEmails.includes(email)) {
            newEmails.push(email)
          }
        })
        return newEmails
      })
    } else {
      // Remove all filtered emails from selection (preserve selections from other filters)
      setSelectedEmails((prev) => prev.filter((email) => !filteredEmails.includes(email)))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSpecialistType("individual")
    setSelectedCities([])
    setSelectedServices({})
    setSearchTerm("")
    setShowSuggestions(false)
    setSpecialistsToShow(SPECIALISTS_PER_PAGE) // Reset pagination when filters change
  }

  const handleSendMessage = () => {
    if (!message.trim()) {
      setError(t("pleaseEnterMessage"))
      return
    }
    if (selectedEmails.length === 0) {
      setError(t("pleaseSelectRecipients"))
      return
    }

    // Clear error and open email client
    setError("")
    if (mailtoLink) {
      window.open(mailtoLink, "_blank")
    }
  }

  const handleServiceToggle = (category: string, service: string) => {
    setSelectedServices((prev) => {
      const categoryServices = prev[category] || []
      const newServices = categoryServices.includes(service)
        ? categoryServices.filter((s) => s !== service)
        : [...categoryServices, service]

      return {
        ...prev,
        [category]: newServices,
      }
    })
  }

  // Clear categories and services when specialist type changes
  useEffect(() => {
    setSelectedCategories([])
    setSelectedServices({})
    setSpecialistsToShow(SPECIALISTS_PER_PAGE) // Reset pagination when specialist type changes
  }, [specialistType])

  useEnterKey(() => {
    if (message.trim() && selectedEmails.length > 0) {
      handleSendMessage()
    }
  }, [message, selectedEmails])

  // Reset pagination when filters change
  useEffect(() => {
    setSpecialistsToShow(SPECIALISTS_PER_PAGE)
  }, [selectedCategories, specialistType, selectedCities, selectedServices, searchTerm])

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return null
  }

  const serviceCategoriesForDisplay = Object.keys(serviceCategories).map((category) => ({
    key: category,
    label: t(category as any),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              InTouch
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {user.role !== "customer" && (
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    {t("dashboard")}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" onClick={logout} className="text-gray-700 hover:text-blue-600">
                <LogOut className="h-5 w-5 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:px-8 flex flex-col gap-8">
        {/* Unimplemented Features Notice */}
        <UnimplementedNotice feature={t("advancedSearchFilters")} />

        {error && (
          <Alert variant="destructive" ref={errorRef}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">{t("filters")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("serviceCategories")}</Label>
                  <div className="space-y-3">
                    {serviceCategoriesForDisplay.map((category) => (
                      <div key={category.key} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category.key}`}
                            checked={selectedCategories.includes(category.key)}
                            onCheckedChange={() => handleCategoryToggle(category.key)}
                          />
                          <Label htmlFor={`cat-${category.key}`} className="font-normal cursor-pointer">
                            {category.label}
                          </Label>
                        </div>

                        {/* Show services for selected category */}
                        {selectedCategories.includes(category.key) &&
                          predefinedServices[category.key as keyof typeof predefinedServices] &&
                          predefinedServices[category.key as keyof typeof predefinedServices].length > 0 && (
                            <div className="ml-3 p-2 bg-blue-50 rounded border max-w-full">
                              <Label className="text-xs font-medium mb-1 block">
                                {t("specificServicesIn")} {category.label}:
                              </Label>
                              <div className="grid grid-cols-1 gap-1 max-w-full">
                                {predefinedServices[category.key as keyof typeof predefinedServices].map((service) => (
                                  <div key={service} className="flex items-center space-x-2 min-w-0">
                                    <Checkbox
                                      id={`service-${category.key}-${service}`}
                                      checked={(selectedServices[category.key] || []).includes(service)}
                                      onCheckedChange={() => handleServiceToggle(category.key, service)}
                                      className="flex-shrink-0"
                                    />
                                    <Label
                                      htmlFor={`service-${category.key}-${service}`}
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
                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("cities")}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="city-all"
                        checked={selectedCities.length === 0}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedCities([])
                        }}
                      />
                      <Label htmlFor="city-all" className="font-normal cursor-pointer">
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
                        <Label htmlFor={`city-${city}`} className="font-normal cursor-pointer">
                          {city}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">{t("specialistType")}</Label>
                  <RadioGroup
                    value={specialistType}
                    onValueChange={(v) => setSpecialistType(v as any)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="type-individual" />
                      <Label htmlFor="type-individual" className="font-normal">
                        {t("physicalPerson")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="type-business" />
                      <Label htmlFor="type-business" className="font-normal">
                        {t("legalEntity")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="bg-transparent" onClick={clearAllFilters}>
                {t("clearFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipients List Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl">
                  {filteredSpecialists.length === 1
                    ? t("foundResult")
                    : `${t("foundResults")} ${filteredSpecialists.length}`}
                </CardTitle>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("searchByNameEmailOrProfession")}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    className="pl-10 pr-4 py-2"
                  />
                </div>

                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto"
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                          index === selectedSuggestionIndex ? "bg-blue-50" : ""
                        } ${suggestion.isSelected ? "bg-green-50" : ""}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{suggestion.name}</div>
                            <div className="text-sm text-gray-500">{suggestion.email}</div>
                            <div className="text-xs text-gray-400">{suggestion.profession}</div>
                          </div>
                          <div className="ml-2">
                            {suggestion.isSelected ? (
                              <div className="text-green-600 text-sm font-medium">{t("selected")}</div>
                            ) : (
                              <div className="text-gray-400 text-sm">{t("clickToSelect")}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {filteredSpecialists.length > 0 && (
                <div className="flex space-x-2 whitespace-nowrap">
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
          <CardContent className="p-6">
            {filteredSpecialists.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                  {filteredSpecialists.slice(0, specialistsToShow).map((specialist) => (
                    <div key={specialist.userId} className="flex items-start space-x-3">
                      <Checkbox
                        id={`email-${specialist.userId}`}
                        checked={selectedEmails.includes(specialist.email!)}
                        onCheckedChange={() => handleEmailSelectionToggle(specialist.email!)}
                        className="mt-1"
                      />
                      <Label htmlFor={`email-${specialist.userId}`} className="font-normal cursor-pointer flex-grow">
                        <span
                          className="block font-semibold truncate"
                          title={
                            specialist.type === "business"
                              ? specialist.companyName
                              : `${specialist.firstName} ${specialist.lastName}`
                          }
                        >
                          {specialist.type === "business"
                            ? specialist.companyName
                            : `${specialist.firstName} ${specialist.lastName}`}
                        </span>
                        <span className="block text-sm text-gray-500 truncate" title={specialist.email}>
                          {specialist.email}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {specialist.profession} •{" "}
                          {specialist.locations.length === 0 ? t("allLithuania") : specialist.locations.join(", ")}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {filteredSpecialists.length > SPECIALISTS_PER_PAGE && (
                  <div className="flex justify-center pt-4">
                    {specialistsToShow < filteredSpecialists.length ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSpecialistsToShow((prev) =>
                            Math.min(prev + SPECIALISTS_PER_PAGE, filteredSpecialists.length),
                          )
                        }
                        className="flex items-center space-x-2"
                      >
                        <span>{t("showMore")}</span>
                        <svg
                          className="h-4 w-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setSpecialistsToShow(SPECIALISTS_PER_PAGE)}
                        className="flex items-center space-x-2"
                      >
                        <span>{t("showLess")}</span>
                        <svg
                          className="h-4 w-4 transition-transform rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-semibold">{t("noResultsFound")}</p>
                <p className="text-sm text-gray-600">{t("adjustFilters")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Card */}
        {filteredSpecialists.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">{t("yourMessage")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Textarea
                id="message"
                rows={8}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (error) setError("")
                }}
                placeholder={t("yourMessage")}
              />

              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || selectedEmails.length === 0}
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="mr-2 h-5 w-5" />
                {t("openInEmailClient")} ({selectedEmails.length})
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
