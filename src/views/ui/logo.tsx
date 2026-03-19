"use client"

import { useState } from "react"
import Image from "next/image"
import { Package } from "lucide-react"

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 60, className = "", showText = false }: LogoProps) {
  const [hasError, setHasError] = useState(false)

  // Ajustando a altura para manter a proporção correta da nova logo
  const height = showText ? size * 1.2 : size

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-supportbox rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <Package className="w-1/2 h-1/2 text-white" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height }}>
      <Image
        src="/logo.png"
        alt="SupportBox Logo"
        fill
        className="object-contain"
        onError={() => setHasError(true)}
        priority
      />
    </div>
  )
}
