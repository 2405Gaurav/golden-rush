"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Candy, ArrowLeft, Menu, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, type Sweet } from "@/lib/api"

export default function EditSweetPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { token, role, isReady } = useAuth()
  const isAdmin = role === "ADMIN"

  const [formData, setFormData] = useState({
    name: "",
    category: "candies",
    price: "",
    stock: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      router.push("/login")
      return
    }
    if (!isAdmin) {
      router.push("/sweets")
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const s = await apiFetch<Sweet>(`/api/sweets/${params.id}`, { token })
        setFormData({
          name: s.name,
          category: s.category,
          price: s.price.toString(),
          stock: String(s.quantity),
          description: "",
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load sweet")
      } finally {
        setLoading(false)
      }
    })()
  }, [isReady, token, isAdmin, params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      await apiFetch<Sweet>(`/api/sweets/${params.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: formData.price,
          quantity: Number(formData.stock),
        }),
      })
      router.push("/sweets")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Candy className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:text-pink-600 transition-colors">
                  SWEET SHOP
                </h1>
              </Link>
            </div>

            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl border-2 border-black bg-transparent">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r-4 border-black p-0">
                  <MobileNavigation />
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Link href="/sweets">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6">EDIT SWEET</h2>

          {error && (
            <div className="mb-6 bg-red-100 border-4 border-black rounded-2xl p-4 font-bold text-red-900">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold">
              Loading...
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-bold mb-2 block">
                    Sweet Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-xl border-2 border-black font-bold bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-lg font-bold mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 border-black font-bold bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black rounded-xl bg-white">
                      <SelectItem value="chocolates" className="font-bold">🍫 Chocolates</SelectItem>
                      <SelectItem value="candies" className="font-bold">🍬 Candies</SelectItem>
                      <SelectItem value="cakes" className="font-bold">🍰 Cakes</SelectItem>
                      <SelectItem value="cookies" className="font-bold">🍪 Cookies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-lg font-bold mb-2 block">
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="h-12 rounded-xl border-2 border-black font-bold bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-lg font-bold mb-2 block">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="h-12 rounded-xl border-2 border-black font-bold bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-lg font-bold mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32 rounded-xl border-2 border-black font-bold bg-white resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/sweets" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg bg-transparent"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
