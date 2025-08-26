// --- MOCK PASSWORD HASHING ---
// In a real app, use a library like bcrypt
const MOCK_PASSWORD_HASH = "$2b$10$fakerakefakerakefakerakeu3eP5wL3/URo2Z.Y5G.x3.g8T9u.1234"

// --- INTERFACES ---
export interface User {
  id: string
  email: string
  passwordHash: string
  role: "customer" | "individual_specialist" | "business_specialist"
  firstName?: string
  lastName?: string
  companyName?: string
  companyCode?: string
  createdAt: string
}

export interface SpecialistProfile {
  userId: string
  profession: string
  categories: string[] // Changed from category to categories (array)
  locations: string[] // Changed from location to locations (array)
  phone: string
  description: string
  services: string[]
  hourlyRate?: number
  experience?: number
  verified: boolean
  image: string
  type: "individual" | "business"
}

// --- PREDEFINED SERVICES ---
// Universal service categories for all specialists
export const serviceCategories = {
  "Automobiliai, transportas": [
    "Akumuliatoriai",
    "Autobusų, mikroautobusų nuoma",
    "Autokosmetika",
    "Automobilių dalys",
    "Automobilių garso ir apsaugos sistemos",
    "Automobilių nuoma",
    "Automobilių parkavimas",
    "Automobilių pervežimas",
    "Automobilių plovyklos",
    "Automobilių prekyba",
    "Automobilių remontas",
    "Automobilių stiklai",
    "Automobilių šaldymo įranga",
    "Automobilių techninė apžiūra",
    "Autosavartynas, naudotos dalys",
    "Autoservisai",
    "Autoservisų, plovyklų, degalinių įranga",
    "Dviračiai",
    "Dviračiai, paspirtukai",
    "Ekspedijavimas",
    "Geležinkelių transportas",
    "Logistikos paslaugos",
    "Motociklai",
    "Oro transportas, aviacija",
    "Padangos, ratlankiai",
    "Pagalba kelyje",
    "Sunkvežimių pardavimas, dalys, remontas",
    "Tepalai, alyvos",
    "Transporto paslaugos",
    "Vandens transportas",
  ],
  "Energetika, žaliavos, kuras": [
    "Antrines žaliavos",
    "Atliekų tvarkymas",
    "Energetika",
    "Gamtos apsauga",
    "Kuras šildymui, malkos, breket...",
    "Kuras, naftos produktai, degal...",
    "Metalų pardavimas, supirkimas",
    "Naudingosios iškasenos",
  ],
  "Finansai, teisė, draudimas": [
    "Antstoliai",
    "Apskaita",
    "Auditas",
    "Bankai, bankinės operacijos",
    "Buhalterinė apskaita",
    "Draudimas",
    "Finansai",
    "Greitieji kreditai, paskolos",
    "Investicinė veikla",
    "Konsultacijų paslaugos",
    "Notarų biurai",
    "Skolų išieškojimas",
    "Tarpininkavimas",
    "Teisinės paslaugos",
    "Teisėtvarka",
    "Turto vertinimas",
  ],
  "Kompiuteriai, IT technologijos": [
    "Interneto paslaugos",
    "Interneto svetainių kūrimas, tvarkymas",
    "Kompiuteriai ir programinė įranga",
    "Kompiuterių remontas, IT paslaugos",
    "Programinės įrangos kūrimas",
    "Telekomunikacijos, ryšio priemonės",
  ],
  "Laisvalaikis, pramogos, turizmas": [
    "Kaimo turizmas",
    "Kavinės, klubai, barai, restoranai",
    "Kelionės",
    "Kino paslaugos",
    "Kultūros centrai",
    "Muziejai",
    "Pirtys ir baseinai",
    "Poilsio namai, sanatorijos",
    "Pramogos ir poilsis",
    "Renginių organizavimas",
    "Sporto paslaugos, sporto klubai",
    "Sveikatingumo, SPA centrai",
    "Teatrai",
    "Viešbučiai, moteliai",
  ],
  "Maisto produktai, gėrimai, prekyba": [
    "Gėrimai (alkoholiniai)",
    "Gėrimai (nealkoholiniai)",
    "Kava, arbata",
    "Kepyklos",
    "Konditerija, saldumynai",
    "Maisto gamyba",
    "Maisto parduotuvės",
    "Maisto produktai",
    "Mėsos perdirbimas, mėsos produktai",
    "Naminiai gyvūnai, maistas, reikmenys",
    "Pienas, pieno produktai",
    "Šaldyti maisto produktai",
    "Šviežį produktai",
  ],
  "Medicina, sveikata, farmacija": [
    "Akušeriai, ginekologai",
    "Estetinė medicina",
    "Globos, rūpybos įstaigos, socialiniai darbuotojai",
    "Greitoji medicinos pagalba",
    "Medicininė įranga",
    "Medicininiai tyrimai, laboratorijos",
    "Medicinos įstaigos",
    "Odontologija, paslaugos",
    "Optika, akiniai",
    "Plastinė, estetinė chirurgija",
    "Privačios gydymo įstaigos",
    "Psichologai, psichoterapeutai",
    "Sanatorijos, reabilitacijos centrai",
    "Vaistai, medicinos medžiagos",
    "Veterinarija",
    "Visuomenės sveikatos priežiūra",
  ],
  "Paslaugos": [
    "Valymo paslaugos",
    "Apsaugos paslaugos",
    "Logistikos paslaugos",
    "Konsultacijos",
    "Vertimo paslaugos",
    "Dizaino paslaugos",
    "Reklamos paslaugos",
    "Personalo paslaugos",
  ],
  "Pramonė, gamyba, įranga": [
    "Pramonės įrangos gamyba",
    "Metalo apdirbimas",
    "Medienos apdirbimas",
    "Tekstilės gamyba",
    "Chemijos pramonė",
    "Maisto pramonė",
    "Įrangos remontas",
    "Automatizacijos sprendimai",
  ],
  "Prekės, prekyba": [
    "Mažmeninė prekyba",
    "Didmeninė prekyba",
    "Elektronikos prekyba",
    "Drabužių prekyba",
    "Namų apyvokos prekės",
    "Sporto prekės",
    "Knygų prekyba",
    "E. prekyba",
  ],
  "Reklama, leidyba": [
    "Reklamos kampanijos",
    "Grafikos dizainas",
    "Spausdinimo paslaugos",
    "Leidybos paslaugos",
    "Socialinių tinklų valdymas",
    "Turinio kūrimas",
    "Fotografijos paslaugos",
    "Video gamyba",
  ],
  "Statyba, remontas, medžiagos, NT": [
    "Bendroji statyba",
    "Namų remontas",
    "Santechnikos darbai",
    "Elektros darbai",
    "Stogų darbai",
    "Grindų klojimas",
    "Dažymo darbai",
    "Nekilnojamojo turto paslaugos",
  ],
  "Švietimas, ugdymas, kultūra": [
    "Mokymo paslaugos",
    "Korepetitorių paslaugos",
    "Kalbų kursai",
    "Muzikos pamokos",
    "Meno pamokos",
    "Kultūros renginiai",
    "Bibliotekų paslaugos",
    "Muziejų paslaugos",
  ],
  "Valstybinės įstaigos, organizacijos": [
    "Administracinės paslaugos",
    "Dokumentų tvarkymas",
    "Licencijų išdavimas",
    "Registracijos paslaugos",
    "Mokesčių administravimas",
    "Socialinės paslaugos",
    "Sveikatos administravimas",
    "Švietimo administravimas",
  ],
  "Žemės ūkis, agrotechnika": [
    "Augalininkystė",
    "Gyvulininkystė",
    "Žemės ūkio konsultacijos",
    "Žemės ūkio technikos nuoma",
    "Sėklų prekyba",
    "Trąšų prekyba",
    "Veterinarijos paslaugos",
    "Ekologinis ūkininkavimas",
  ],
}

// Export predefinedServices as an alias for serviceCategories
export const predefinedServices = serviceCategories

// Default cities
const defaultCities = [
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

// --- MOCK DATABASE ---
const users: User[] = [
  {
    id: "user_1",
    email: "customer@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "customer",
    firstName: "Petras",
    lastName: "Klientauskas",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_2",
    email: "individual@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Gintarė",
    lastName: "Urbonaitė",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_3",
    email: "business@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "business_specialist",
    companyName: "Petraičio Santechnika MB",
    companyCode: "305123456",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_4",
    email: "programmer@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Tomas",
    lastName: "Programauskas",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_5",
    email: "itcompany@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "business_specialist",
    companyName: "TechSolutions UAB",
    companyCode: "305987654",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_6",
    email: "photographer@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Laura",
    lastName: "Fotografė",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_7",
    email: "accountant@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Rasa",
    lastName: "Skaičiuotoja",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_8",
    email: "cleaning@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "business_specialist",
    companyName: "Švarūs Namai MB",
    companyCode: "305456789",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_9",
    email: "teacher@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Ingrida",
    lastName: "Mokytoja",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_10",
    email: "massage@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Vida",
    lastName: "Masažuotoja",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_11",
    email: "restaurant@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "business_specialist",
    companyName: "Skanus Maistas UAB",
    companyCode: "305123789",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_12",
    email: "lawyer@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Mindaugas",
    lastName: "Teisininkas",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_13",
    email: "trainer@intouch.lt",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "individual_specialist",
    firstName: "Eglė",
    lastName: "Trenerė",
    createdAt: new Date().toISOString(),
  },
]

const specialistProfiles: SpecialistProfile[] = [
  {
    userId: "user_2",
    type: "individual",
    profession: "Grafikos dizainerė",
    categories: ["Dizainas/Kūryba"],
    locations: ["Klaipėda"],
    phone: "+37060045678",
    description: "Kūrybinga grafikos dizainerė su 10 metų patirtimi.",
    services: ["Grafikos dizainas", "Logo kūrimas"],
    hourlyRate: 35,
    experience: 10,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_3",
    type: "business",
    profession: "Santechnikas",
    categories: ["Statyba"],
    locations: ["Vilnius"],
    phone: "+37060012345",
    description: "Profesionalus santechnikas su 8 metų patirtimi.",
    services: ["Renovacijos darbai", "Interjero apdaila"],
    hourlyRate: 25,
    experience: 8,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_4",
    type: "individual",
    profession: "Programuotojas",
    categories: ["Programavimas/IT"],
    locations: ["Vilnius", "Kaunas"],
    phone: "+37060098765",
    description: "Full-stack programuotojas specializuojantis web aplikacijose.",
    services: ["Web svetainių kūrimas", "Programinės įrangos kūrimas"],
    hourlyRate: 45,
    experience: 6,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_5",
    type: "business",
    profession: "IT konsultantas",
    categories: ["Technologijos"],
    locations: ["Vilnius"],
    phone: "+37060087654",
    description: "IT konsultacijų įmonė su 15 metų patirtimi rinkoje.",
    services: ["IT konsultacijos", "Programinės įrangos kūrimas"],
    hourlyRate: 60,
    experience: 15,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_6",
    type: "individual",
    profession: "Fotografė",
    categories: ["Fotografija/Filmavimas"],
    locations: ["Kaunas"],
    phone: "+37060076543",
    description: "Profesionali fotografė specializuojantis vestuvių fotografijoje.",
    services: ["Vestuvių fotografija", "Portretų fotografija"],
    hourlyRate: 40,
    experience: 8,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_7",
    type: "individual",
    profession: "Buhalterė",
    categories: ["Apskaita/Buhalterija"],
    locations: ["Šiauliai"],
    phone: "+37060065432",
    description: "Patyrusi buhalterė su CPA sertifikatu.",
    services: ["Buhalterinės apskaitos vedimas", "Mokesčių deklaravimas"],
    hourlyRate: 30,
    experience: 12,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_8",
    type: "business",
    profession: "Valymo paslaugos",
    categories: ["Kita"],
    locations: ["Vilnius", "Kaunas"],
    phone: "+37060054321",
    description: "Profesionalios valymo paslaugos namams ir biurams.",
    services: ["Namų valymas", "Biurų valymas"],
    hourlyRate: 20,
    experience: 5,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_9",
    type: "individual",
    profession: "Anglų kalbos mokytoja",
    categories: ["Mokymas/Korepetavimas"],
    locations: ["Klaipėda"],
    phone: "+37060043210",
    description: "Anglų kalbos mokytoja su tarptautiniu sertifikatu.",
    services: ["Anglų kalbos pamokos", "Kompiuterinio raštingumo kursai"],
    hourlyRate: 25,
    experience: 7,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_10",
    type: "individual",
    profession: "Masažuotoja",
    categories: ["Sveikatos priežiūros paslaugos"],
    locations: ["Panevėžys"],
    phone: "+37060032109",
    description: "Licencijuota masažuotoja specializuojantis terapiniame masaže.",
    services: ["Masažas", "Fizioterapija"],
    hourlyRate: 35,
    experience: 9,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_11",
    type: "business",
    profession: "Restorano paslaugos",
    categories: ["Apgyvendinimas ir maitinimas"],
    locations: ["Vilnius"],
    phone: "+37060021098",
    description: "Aukštos kokybės maitinimo paslaugos renginiams.",
    services: ["Maitinimo paslaugos", "Renginių organizavimas"],
    hourlyRate: 50,
    experience: 10,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_12",
    type: "individual",
    profession: "Teisės konsultantas",
    categories: ["Teisinės paslaugos"],
    locations: ["Alytus"],
    phone: "+37060010987",
    description: "Teisės konsultantas specializuojantis verslo teisėje.",
    services: ["Teisinės konsultacijos", "Dokumentų rengimas"],
    hourlyRate: 55,
    experience: 14,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    userId: "user_13",
    type: "individual",
    profession: "Fitnes trenerė",
    categories: ["Asmeninis treniravimas"],
    locations: ["Marijampolė"],
    phone: "+37060009876",
    description: "Sertifikuota fitnes trenerė su sporto mokslo išsilavinimu.",
    services: ["Fitnes treneris", "Mitybos plano sudarymas"],
    hourlyRate: 30,
    experience: 5,
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
]

// --- DATABASE ACCESS LAYER ---
export const db = {
  users: {
    async findByEmail(email: string): Promise<User | undefined> {
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    },
    async create(data: Omit<User, "id" | "createdAt" | "passwordHash"> & { password?: string }): Promise<User> {
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        passwordHash: MOCK_PASSWORD_HASH, // In real app: await bcrypt.hash(data.password, 10)
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      return newUser
    },
  },
  specialists: {
    async getAll() {
      // Join user and specialist data
      return specialistProfiles.map((profile) => {
        const user = users.find((u) => u.id === profile.userId)
        return {
          ...profile,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          companyName: user?.companyName,
          companyCode: user?.companyCode,
        }
      })
    },
    async createProfile(
      data: Omit<SpecialistProfile, "verified" | "image" | "hourlyRate" | "experience">,
    ): Promise<SpecialistProfile> {
      const newProfile: SpecialistProfile = {
        ...data,
        hourlyRate: 25, // Default hourly rate
        experience: 1, // Default experience
        verified: false, // Verification would be a separate process
        image: "/placeholder.svg?height=200&width=200",
      }
      specialistProfiles.push(newProfile)
      return newProfile
    },
    async updateProfile(userId: string, updates: Partial<SpecialistProfile>): Promise<SpecialistProfile | null> {
      const profileIndex = specialistProfiles.findIndex((p) => p.userId === userId)
      if (profileIndex === -1) return null

      specialistProfiles[profileIndex] = { ...specialistProfiles[profileIndex], ...updates }
      return specialistProfiles[profileIndex]
    },
    async getByUserId(userId: string): Promise<SpecialistProfile | undefined> {
      return specialistProfiles.find((p) => p.userId === userId)
    },
  },
  // Mock password comparison
  async comparePassword(password: string, hash: string): Promise<boolean> {
    // In a real app: return await bcrypt.compare(password, hash)
    return password.length > 0 && hash === MOCK_PASSWORD_HASH
  },
}

// This is the type that will be returned from the joined query
export type FullSpecialistProfile = Awaited<ReturnType<typeof db.specialists.getAll>>[0]