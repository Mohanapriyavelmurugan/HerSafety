"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("hersafety_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, check if user exists in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("hersafety_registered_users") || "[]")
      const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        setIsLoading(false)
        return false
      }

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      }

      setUser(userData)
      localStorage.setItem("hersafety_user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem("hersafety_registered_users") || "[]")
      if (registeredUsers.some((u: any) => u.email === email)) {
        setIsLoading(false)
        return false
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone,
        password,
      }

      // Save to localStorage
      registeredUsers.push(newUser)
      localStorage.setItem("hersafety_registered_users", JSON.stringify(registeredUsers))

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hersafety_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
