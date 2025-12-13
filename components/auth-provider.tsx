"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { apiFetch, type AuthResponse, type Role } from "@/lib/api"

type AuthState = {
  token: string | null
  role: Role | null
  email: string | null
  isReady: boolean
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const LS_KEY = "sweetshop.auth"

function saveAuth(auth: AuthResponse) {
  localStorage.setItem(LS_KEY, JSON.stringify(auth))
}

function loadAuth(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthResponse
    if (!parsed?.accessToken) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const existing = loadAuth()
    if (existing) {
      setToken(existing.accessToken)
      setRole(existing.role)
      setEmail(existing.email)
    }
    setIsReady(true)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      email,
      isReady,
      login: async (emailIn: string, password: string) => {
        const res = await apiFetch<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: emailIn, password }),
        })
        saveAuth(res)
        setToken(res.accessToken)
        setRole(res.role)
        setEmail(res.email)
      },
      register: async (emailIn: string, password: string) => {
        const res = await apiFetch<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email: emailIn, password }),
        })
        saveAuth(res)
        setToken(res.accessToken)
        setRole(res.role)
        setEmail(res.email)
      },
      logout: () => {
        localStorage.removeItem(LS_KEY)
        setToken(null)
        setRole(null)
        setEmail(null)
      },
    }),
    [token, role, email, isReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}





