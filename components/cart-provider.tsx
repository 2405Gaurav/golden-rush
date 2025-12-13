"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Sweet } from "@/lib/api"

export type CartItem = {
  sweet: Sweet
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (sweet: Sweet, quantity?: number) => void
  removeItem: (sweetId: string) => void
  updateQuantity: (sweetId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const LS_KEY = "sweetshop.cart"

function saveCart(items: CartItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(loadCart())
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (sweet: Sweet, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.sweet.id === sweet.id)
      if (existing) {
        return prev.map((item) =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { sweet, quantity }]
    })
  }

  const removeItem = (sweetId: string) => {
    setItems((prev) => prev.filter((item) => item.sweet.id !== sweetId))
  }

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(sweetId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.sweet.id === sweetId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parseFloat(item.sweet.price) * item.quantity,
        0
      ),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, totalItems, totalPrice]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}

