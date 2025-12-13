// Category to image mapping
const categoryImages: Record<string, string[]> = {
  chocolates: ["/chocolate-truffles.png", "/mint-chocolate-bar.jpg", "/caramel-fudge.jpg"],
  candies: ["/colorful-gummy-bears.jpg", "/rainbow-lollipops.jpg"],
  cakes: ["/strawberry-cupcakes.jpg", "/vanilla-macarons.jpg"],
  cookies: ["/chocolate-chip-cookies.png"],
}

// Get image for a category (cycles through available images based on name hash)
export function getImageForCategory(category: string, name?: string): string {
  const normalizedCategory = category.toLowerCase().trim()
  const images = categoryImages[normalizedCategory]
  
  if (!images || images.length === 0) {
    return "/placeholder.jpg"
  }
  
  // If name is provided, use it to consistently select the same image for the same sweet
  if (name) {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return images[hash % images.length]
  }
  
  // Otherwise return first image
  return images[0]
}

// Get all images for a category (for selection UI)
export function getImagesForCategory(category: string): string[] {
  const normalizedCategory = category.toLowerCase().trim()
  return categoryImages[normalizedCategory] || ["/placeholder.jpg"]
}


