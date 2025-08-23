"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User as DbUser } from "./database"

export type User = Omit<DbUser, "passwordHash">

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  updateUser: (updatedData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    const { passwordHash, ...userToStore } = userData as DbUser
    setUser(userToStore)
    localStorage.setItem("user", JSON.stringify(userToStore))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
