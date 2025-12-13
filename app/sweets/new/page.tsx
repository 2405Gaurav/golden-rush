"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Candy, ArrowLeft, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, type Sweet } from "@/lib/api"
import { getImagesForCategory } from "@/lib/image-utils"

export default function NewSweetPage() {
  const router = useRouter()
  const { token, role, isReady } = useAuth()
  const isAdmin = role === "ADMIN"
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-select image when category changes
  useEffect(() => {
    if (formData.category) {
      const images = getImagesForCategory(formData.category)
      // Select first image for the category, or keep current if it's still valid
      if (!formData.image || !images.includes(formData.image)) {
        setFormData((prev) => ({ ...prev, image: images[0] }))
      }
    }
  }, [formData.category])

  useEffect(() => {
    if (!isReady) return
    if (!token) router.push("/login")
    else if (!isAdmin) router.push("/sweets")
  }, [isReady, token, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      await apiFetch<Sweet>("/api/sweets", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: formData.price,
          quantity: Number(formData.stock),
        }),
      })
      router.push("/sweets")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sweet")
    } finally {
      setLoading(false)
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
          <h2 className="text-2xl sm:text-3xl font-black mb-6">ADD NEW SWEET</h2>

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
                    placeholder="e.g., Chocolate Truffles"
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

                {formData.category && (
                  <div>
                    <Label className="text-lg font-bold mb-2 block">
                      Image (Auto-selected for {formData.category})
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {getImagesForCategory(formData.category).map((img) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img })}
                          className={`relative w-24 h-24 rounded-xl border-4 border-black overflow-hidden ${
                            formData.image === img
                              ? "ring-4 ring-pink-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                              : "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          } transition-all`}
                        >
                          <Image
                            src={img}
                            alt={formData.category}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg"
                            }}
                          />
                          {formData.image === img && (
                            <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center z-10">
                              <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-black font-black">
                                ✓
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {formData.image && (
                      <p className="mt-2 text-sm font-bold text-gray-600">
                        Selected: {formData.image}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-lg font-bold mb-2 block">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
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
                      placeholder="0"
                      className="h-12 rounded-xl border-2 border-black font-bold bg-white"
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
                    placeholder="Describe your sweet..."
                    className="min-h-32 rounded-xl border-2 border-black font-bold bg-white resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-black rounded-2xl p-4 font-bold text-red-900">{error}</div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
              >
                {loading ? "Creating..." : "Create Sweet"}
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
        </div>
      </div>
    </div>
  )
}
