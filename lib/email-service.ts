// Email service integration for 3rd party APIs
export class EmailService {
  private static apiKey = process.env.EMAIL_API_KEY || ""
  private static baseUrl = "https://api.emailservice.com/v1"

  static async sendEmail(to: string, subject: string, body: string, from?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to,
          from: from || "noreply@intouch.lt",
          subject,
          html: body,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      return await response.json()
    } catch (error) {
      console.error("Email sending failed:", error)
      throw error
    }
  }

  static async sendContactNotification(specialistEmail: string, customerName: string, message: string) {
    const subject = `Nauja užklausa iš ${customerName} - InTouch`
    const body = `
    <h2>Gavote naują užklausą!</h2>
    <p><strong>Nuo:</strong> ${customerName}</p>
    <p><strong>Žinutė:</strong></p>
    <p>${message}</p>
    <p>Galite atsakyti tiesiogiai į šį el. laišką.</p>
  `

    return this.sendEmail(specialistEmail, subject, body)
  }
}
