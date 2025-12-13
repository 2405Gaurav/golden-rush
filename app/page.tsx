"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Candy, Plus, LogOut, ShoppingCart, Search } from "lucide-react"
import SweetCard from "@/components/sweet-card"
import QuickStats from "@/components/quick-stats"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { apiFetch, type Sweet } from "@/lib/api"
import { useState, useMemo } from "react"
import { getImageForCategory } from "@/lib/image-utils"
import LandingPage from "@/components/landing-page"

export default function Dashboard() {
  const router = useRouter()
  const { token, role, isReady, logout } = useAuth()
  const { totalItems } = useCart()
  const [allSweets, setAllSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const isAdmin = role === "ADMIN"

  useEffect(() => {
    if (!isReady) return
    
    // If no token, don't fetch data (landing page will be shown)
    if (!token) {
      return
    }

    // Fetch all sweets if authenticated
    const fetchSweets = async () => {
      try {
        setLoading(true)
        const sweets = await apiFetch<Sweet[]>("/api/sweets", { token })
        setAllSweets(sweets)
      } catch (e) {
        console.error("Failed to load sweets:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchSweets()

    // Listen for purchase events to refresh data
    const handlePurchase = () => {
      fetchSweets()
    }
    window.addEventListener("purchase", handlePurchase)
    window.addEventListener("storage", handlePurchase)

    return () => {
      window.removeEventListener("purchase", handlePurchase)
      window.removeEventListener("storage", handlePurchase)
    }
  }, [isReady, token, router])

  // Filter sweets by category and search query
  const filteredSweets = useMemo(() => {
    let filtered = allSweets

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((sweet) => sweet.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(query) ||
          sweet.category.toLowerCase().includes(query) ||
          sweet.price.toString().includes(query)
      )
    }

    return filtered
  }, [allSweets, selectedCategory, searchQuery])

  // Show landing page immediately for unauthenticated users (no auth required)
  if (!token) {
    return <LandingPage />
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      {/* Glassmorphic container */}
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Candy className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">SWEET SHOP</h1>
            </div>

            {/* Mobile menu */}
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

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search sweets..."
                  className="pl-10 h-10 w-48 rounded-xl border-2 border-black font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
              <Link href="/sweets">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                >
                  {isAdmin ? "All Sweets" : "Shop"}
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

        <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-6rem)]">
          {/* Sidebar - Desktop only */}
          <div className="hidden md:block border-r-4 border-black bg-white/40 p-4">
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold p-3 bg-black text-white rounded-xl">
                Dashboard
              </Link>
              <Link
                href="/sweets"
                className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
              >
                {isAdmin ? "All Sweets" : "Shop"}
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/inventory"
                    className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
                  >
                    Inventory
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/analytics"
                    className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
                  >
                    Analytics
                  </Link>
                </>
              )}
              {!isAdmin && (
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {totalItems > 0 && (
                    <span className="bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-black">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            <div className="mt-8">
              <h2 className="text-xl font-black mb-4">CATEGORIES</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(selectedCategory === "chocolates" ? null : "chocolates")}
                  className={`w-full justify-start gap-2 rounded-xl border-2 border-black font-bold ${
                    selectedCategory === "chocolates" ? "bg-pink-200" : "bg-transparent"
                  }`}
                >
                  🍫 Chocolates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(selectedCategory === "candies" ? null : "candies")}
                  className={`w-full justify-start gap-2 rounded-xl border-2 border-black font-bold ${
                    selectedCategory === "candies" ? "bg-pink-200" : "bg-transparent"
                  }`}
                >
                  🍬 Candies
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(selectedCategory === "cakes" ? null : "cakes")}
                  className={`w-full justify-start gap-2 rounded-xl border-2 border-black font-bold ${
                    selectedCategory === "cakes" ? "bg-pink-200" : "bg-transparent"
                  }`}
                >
                  🍰 Cakes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(selectedCategory === "cookies" ? null : "cookies")}
                  className={`w-full justify-start gap-2 rounded-xl border-2 border-black font-bold ${
                    selectedCategory === "cookies" ? "bg-pink-200" : "bg-transparent"
                  }`}
                >
                  🍪 Cookies
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="overflow-auto p-4 sm:p-6">
            {isAdmin && <QuickStats />}

            {!isAdmin && (
              <div className="mb-8 bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-2">Welcome to Sweet Shop!</h2>
                <p className="text-gray-600 font-bold">Browse our delicious collection of sweets and add them to your cart.</p>
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black">{isAdmin ? "POPULAR SWEETS" : "FEATURED SWEETS"}</h2>
                <Link href="/sweets">
                  <Button
                    variant="outline"
                    className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                  >
                    View All
                  </Button>
                </Link>
              </div>
              {loading ? (
                <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-center">
                  Loading sweets...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSweets.map((sweet) => (
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
                    />
                  ))}
                  {filteredSweets.length === 0 && !loading && (
                    <div className="col-span-full bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-center">
                      {selectedCategory || searchQuery ? "No sweets found matching your filters" : "No sweets available"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
