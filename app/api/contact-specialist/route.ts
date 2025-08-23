import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { specialistEmail, customerName, customerEmail, message } = await request.json()

    // Send notification to specialist
    await EmailService.sendContactNotification(specialistEmail, customerName, message)

    // You could also send a confirmation email to the customer
    await EmailService.sendEmail(
      customerEmail,
      "Užklausa išsiųsta - InTouch",
      `<p>Jūsų žinutė buvo išsiųsta specialistui. Jis susisieks su jumis tiesiogiai.</p>`,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact specialist error:", error)
    return NextResponse.json({ error: "Failed to send contact request" }, { status: 500 })
  }
}
