"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Candy, Shield, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      // Check role after login - only allow admins
      const authData = JSON.parse(localStorage.getItem("sweetshop.auth") || "{}")
      if (authData.role === "ADMIN") {
        router.push("/inventory")
      } else {
        setError("Access denied. Admin credentials required. Please use the regular login page for user accounts.")
        // Clear auth data for non-admin users
        localStorage.removeItem("sweetshop.auth")
        // Reset form
        setEmail("")
        setPassword("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
            <Link href="/">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:text-purple-600 transition-colors">
                ADMIN LOGIN
              </h1>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">ADMIN DASHBOARD</h2>
          <p className="text-gray-600 mb-6 font-bold">Access restricted to administrators only</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div>
                <Label htmlFor="email" className="text-lg font-bold mb-2 block">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 border-black font-bold bg-white"
                  placeholder="admin@sweetshop.local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-lg font-bold mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 border-black font-bold bg-white"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-black rounded-xl p-3 font-bold text-red-800">{error}</div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                {loading ? "Signing in..." : "Admin Sign In"}
              </Button>
              <Link href="/login" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg bg-transparent"
                >
                  User Login
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

