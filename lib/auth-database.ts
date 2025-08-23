export class AuthDatabase {
  private static users = [
    {
      id: "user_001",
      firstName: "Jonas",
      lastName: "Jonaitis",
      email: "jonas@example.com",
      phone: "+37060000000",
      userType: "customer",
      location: "Vilnius",
      joinDate: "2024-01-01",
      verified: true,
    },
    {
      id: "user_002",
      firstName: "Ona",
      lastName: "Onaitiene",
      email: "ona@example.com",
      phone: "+37060000001",
      userType: "specialist",
      location: "Kaunas",
      joinDate: "2024-02-15",
      verified: true,
    },
  ]

  static loginUser(credentials: { email: string; password: string }): { success: boolean; user?: any; error?: string } {
    const user = this.users.find((u) => u.email === credentials.email)

    if (!user) {
      return { success: false, error: "Vartotojas nerastas." }
    }

    // Basic password check (in real app, use proper hashing)
    if (credentials.password !== "password") {
      return { success: false, error: "Neteisingas slaptažodis." }
    }

    return { success: true, user }
  }
}
