"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Mail, Eye, Reply, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Inquiry {
  id: string
  clientName: string
  clientEmail: string
  date: string
  subject: string
  message: string
  status: "pending" | "responded" | "inProgress" | "completed"
  priority: "low" | "medium" | "high"
  response?: string
  responseDate?: string
}

export default function InquiriesPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [response, setResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)

  useEffect(() => {
    if (!user || user.role === "customer") {
      router.push("/dashboard")
      return
    }

    // Mock inquiries data
    const mockInquiries: Inquiry[] = [
      {
        id: "1",
        clientName: 'UAB "Statybos projektai"',
        clientEmail: "info@statybosprojektai.lt",
        date: "2024-01-15",
        subject: "Biuro renovacija",
        message:
          "Sveiki, ieškome specialisto biuro patalpų renovacijai. Plotas ~200 kv.m. Ar galėtumėte pateikti pasiūlymą?",
        status: "pending",
        priority: "high",
      },
      {
        id: "2",
        clientName: "Jonas Petraitis",
        clientEmail: "jonas.petraitis@gmail.com",
        date: "2024-01-14",
        subject: "Vonios remontas",
        message: "Reikia atlikti vonios remontą. Keisti plyteles, santechniką. Kada galėtumėte atvykti apžiūrai?",
        status: "responded",
        priority: "medium",
        response: "Ačiū už užklausą! Galiu atvykti apžiūrai šią savaitę. Susisieksiu telefonu dėl tikslaus laiko.",
        responseDate: "2024-01-14",
      },
      {
        id: "3",
        clientName: 'MB "Dizaino studija"',
        clientEmail: "hello@dizainostudija.lt",
        date: "2024-01-13",
        subject: "Interjero dizainas",
        message: "Ieškome interjero dizainerio naujo ofiso projektui. Ar turite patirties komercinių patalpų dizaine?",
        status: "inProgress",
        priority: "high",
      },
      {
        id: "4",
        clientName: "Ona Jonaitienė",
        clientEmail: "ona.jonaitiene@yahoo.com",
        date: "2024-01-12",
        subject: "Virtuvės įrengimas",
        message: "Norėčiau įrengti naują virtuvę. Ar galėtumėte pateikti preliminarų kainos pasiūlymą?",
        status: "completed",
        priority: "low",
      },
    ]

    setInquiries(mockInquiries)
  }, [user, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {t("pending")}
          </Badge>
        )
      case "responded":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("responded")}
          </Badge>
        )
      case "inProgress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("inProgress")}
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("completed")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const handleRespond = async (inquiry: Inquiry) => {
    if (!response.trim()) return

    setIsResponding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update inquiry status
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiry.id
          ? { ...inq, status: "responded" as const, response, responseDate: new Date().toISOString().split("T")[0] }
          : inq,
      ),
    )

    setResponse("")
    setSelectedInquiry(null)
    setIsResponding(false)
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

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t("clientInquiries")}</h1>
          <p className="text-gray-600">{t("manageClientInquiries")}</p>
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className={`border-l-4 ${getPriorityColor(inquiry.priority)}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>{t("from")}:</strong> {inquiry.clientName} ({inquiry.clientEmail})
                      </p>
                      <p>
                        <strong>{t("date")}:</strong> {inquiry.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t("view")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{inquiry.subject}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">{t("clientMessage")}:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded">{inquiry.message}</p>
                          </div>
                          {inquiry.response && (
                            <div>
                              <h4 className="font-semibold mb-2">
                                {t("yourResponse")} ({inquiry.responseDate}):
                              </h4>
                              <p className="text-gray-700 bg-blue-50 p-3 rounded">{inquiry.response}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {inquiry.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedInquiry(inquiry)}>
                            <Reply className="h-4 w-4 mr-2" />
                            {t("respond")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{t("respondToInquiry")}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">{t("originalMessage")}:</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm">{inquiry.message}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">{t("yourResponse")}:</label>
                              <Textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder={t("typeYourResponse")}
                                rows={6}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedInquiry(null)
                                  setResponse("")
                                }}
                              >
                                {t("cancel")}
                              </Button>
                              <Button
                                onClick={() => handleRespond(inquiry)}
                                disabled={!response.trim() || isResponding}
                              >
                                {isResponding ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    {t("sending")}
                                  </>
                                ) : (
                                  <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    {t("sendResponse")}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-2">{inquiry.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {inquiries.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("noInquiries")}</h3>
              <p className="text-gray-600">{t("noInquiriesDescription")}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
