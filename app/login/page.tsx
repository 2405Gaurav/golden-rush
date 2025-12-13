"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Candy, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
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
      // Check role after login - reject admins from regular login
      const authData = JSON.parse(localStorage.getItem("sweetshop.auth") || "{}")
      if (authData.role === "ADMIN") {
        // Clear auth data and show error
        localStorage.removeItem("sweetshop.auth")
        setError("Admin users must login through the Admin Login page.")
        return
      }
      // Regular users go to sweets page
      router.push("/sweets")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Candy className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
            <Link href="/">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:text-pink-600 transition-colors">
                SWEET SHOP
              </h1>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6">LOGIN</h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div>
                <Label htmlFor="email" className="text-lg font-bold mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 border-black font-bold bg-white"
                  placeholder="you@example.com"
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

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="flex gap-3">
                <Link href="/register" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg bg-transparent"
                  >
                    Register
                  </Button>
                </Link>
                <Link href="/admin/login" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg bg-transparent"
                  >
                    Admin Login
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




