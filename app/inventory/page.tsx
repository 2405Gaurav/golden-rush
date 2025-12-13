"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, Menu, AlertTriangle, Package, TrendingDown } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, type Sweet } from "@/lib/api"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Row = {
  id: string
  name: string
  category: string
  stock: number
  status: "good" | "low" | "critical"
}

export default function InventoryPage() {
  const router = useRouter()
  const { token, role, isReady } = useAuth()
  const isAdmin = role === "ADMIN"

  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const sweets = await apiFetch<Sweet[]>("/api/sweets", { token })
        const rows: Row[] = sweets.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          stock: s.quantity,
          status: s.quantity <= 10 ? "critical" : s.quantity <= 25 ? "low" : "good",
        }))
        setItems(rows)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load inventory")
      } finally {
        setLoading(false)
      }
    })()
  }, [isReady, token, router])

  const stats = useMemo(() => {
    const inStock = items.filter((i) => i.stock > 0).length
    const lowStock = items.filter((i) => i.status === "low").length
    const critical = items.filter((i) => i.status === "critical").length
    return { inStock, lowStock, critical }
  }, [items])

  async function restock(id: string) {
    if (!token) return
    if (!isAdmin) {
      alert("Admin only")
      return
    }
    const qStr = prompt("Restock quantity (>=1):", "10")
    const q = Number(qStr)
    if (!Number.isFinite(q) || q < 1) return
    try {
      const updated = await apiFetch<Sweet>(`/api/sweets/${id}/restock`, {
        method: "POST",
        token,
        body: JSON.stringify({ quantity: q }),
      })
      setItems((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                stock: updated.quantity,
                status: updated.quantity <= 10 ? "critical" : updated.quantity <= 25 ? "low" : "good",
              }
            : r,
        ),
      )
    } catch (e) {
      alert(e instanceof Error ? e.message : "Restock failed")
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
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6">INVENTORY STATUS</h2>

          {error && (
            <div className="mb-6 bg-red-100 border-4 border-black rounded-2xl p-4 font-bold text-red-900">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-green-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">In Stock</p>
              <p className="text-2xl font-black">{stats.inStock} items</p>
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-yellow-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <TrendingDown className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">Low Stock</p>
              <p className="text-2xl font-black">{stats.lowStock} items</p>
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-red-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">Critical</p>
              <p className="text-2xl font-black">{stats.critical} item(s)</p>
            </div>
          </div>

          <div className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black bg-pink-100">
                    <th className="text-left p-4 font-black text-lg">Product</th>
                    <th className="text-left p-4 font-black text-lg">Category</th>
                    <th className="text-left p-4 font-black text-lg">Stock</th>
                    <th className="text-left p-4 font-black text-lg">Status</th>
                    <th className="text-left p-4 font-black text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-b-2 border-black">
                      <td className="p-4 font-bold" colSpan={5}>
                        Loading...
                      </td>
                    </tr>
                  ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b-2 border-black">
                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4 font-bold">{item.category}</td>
                      <td className="p-4 font-bold">{item.stock}</td>
                      <td className="p-4">
                        {item.status === "critical" && (
                          <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Critical
                          </span>
                        )}
                        {item.status === "low" && (
                          <span className="inline-block bg-yellow-400 px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Low
                          </span>
                        )}
                        {item.status === "good" && (
                          <span className="inline-block bg-green-400 px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Good
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          onClick={() => restock(item.id)}
                          disabled={!isAdmin}
                          className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold disabled:opacity-60"
                        >
                          Restock
                        </Button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
