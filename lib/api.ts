export type Role = "USER" | "ADMIN"

export type AuthResponse = {
  accessToken: string
  role: Role
  email: string
}

export type Sweet = {
  id: string
  name: string
  category: string
  price: string // backend returns BigDecimal; treat as string for precision
  quantity: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export function getApiBase() {
  return API_BASE
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers = new Headers(opts.headers || {})
  headers.set("Content-Type", headers.get("Content-Type") || "application/json")
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`)

  const res = await fetch(url, {
    ...opts,
    headers,
  })

  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const text = await res.text()
      if (text) {
        const body = JSON.parse(text)
        msg = body?.message || msg
      }
    } catch {
      // ignore
    }
    throw new Error(msg)
  }

  // 204 no content
  if (res.status === 204) {
    return undefined as T
  }

  // Check if response has content before parsing
  const contentType = res.headers.get("content-type")
  const text = await res.text()
  
  // If no content, return undefined
  if (!text || text.trim() === "") {
    return undefined as T
  }

  // If content exists but not JSON, return undefined
  if (contentType && !contentType.includes("application/json")) {
    return undefined as T
  }

  // Try to parse JSON
  try {
    return JSON.parse(text) as T
  } catch {
    // If JSON parsing fails, return undefined
    return undefined as T
  }
}





