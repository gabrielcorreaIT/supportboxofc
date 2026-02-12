import { Package } from "lucide-react"

export function PlaceholderLogo({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  }

  const iconSizes = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-10 w-10",
  }

  return (
    <div className={`flex items-center justify-center bg-supportbox rounded-full ${sizeClasses[size]}`}>
      <Package className={`${iconSizes[size]} text-white`} />
    </div>
  )
}
