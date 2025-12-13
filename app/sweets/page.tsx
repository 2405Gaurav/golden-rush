"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Candy, Plus, Search, Menu, LogOut, ShoppingCart } from "lucide-react"
import SweetCard from "@/components/sweet-card"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { apiFetch, type Sweet } from "@/lib/api"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { trackPurchase } from "@/components/quick-stats"
import { getImageForCategory } from "@/lib/image-utils"

export default function SweetsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, role, isReady, logout } = useAuth()
  const { totalItems } = useCart()
  const isAdmin = role === "ADMIN"

  const [query, setQuery] = useState("")
  const [items, setItems] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"))

  const filtered = useMemo(() => {
    let result = items

    // Filter by category if selected
    if (selectedCategory) {
      result = result.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by search query
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.price.toString().includes(q),
      )
    }

    return result
  }, [items, query, selectedCategory])

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      router.push("/login")
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiFetch<Sweet[]>("/api/sweets", { token })
        setItems(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load sweets")
      } finally {
        setLoading(false)
      }
    })()
  }, [isReady, token, router])

  // Update selected category when URL param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    setSelectedCategory(categoryParam)
  }, [searchParams])

  async function purchase(id: string) {
    if (!token) return
    try {
      const sweet = items.find((s) => s.id === id)
      const updated = await apiFetch<Sweet>(`/api/sweets/${id}/purchase`, {
        method: "POST",
        token,
        body: JSON.stringify({ quantity: 1 }),
      })
      setItems((prev) => prev.map((s) => (s.id === id ? updated : s)))
      
      // Track purchase for dashboard stats
      if (sweet) {
        const purchaseAmount = parseFloat(sweet.price)
        trackPurchase(purchaseAmount)
        window.dispatchEvent(new CustomEvent("purchase"))
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Purchase failed")
    }
  }

  async function deleteSweet(id: string) {
    if (!token) return
    if (!confirm("Delete this sweet?")) return
    try {
      await apiFetch<void>(`/api/sweets/${id}`, { method: "DELETE", token })
      setItems((prev) => prev.filter((s) => s.id !== id))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
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
              {isAdmin && (
                <Link href="/sweets/new">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sweet
                  </Button>
                </Link>
              )}
              {!isAdmin && (
                <Link href="/cart">
                  <Button className="relative bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-black">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
                variant="outline"
                className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">ALL SWEETS</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search sweets..."
                className="pl-12 h-14 rounded-xl border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border-4 border-black rounded-2xl p-4 font-bold text-red-900">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold">
              Loading sweets...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((sweet) => (
              <SweetCard
                key={sweet.id}
                id={sweet.id}
                name={sweet.name}
                category={sweet.category}
                price={Number(sweet.price)}
                stock={sweet.quantity}
                image={getImageForCategory(sweet.category, sweet.name)}
                canAdmin={isAdmin}
                sweet={sweet}
                onPurchase={() => purchase(sweet.id)}
                onDelete={() => deleteSweet(sweet.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
