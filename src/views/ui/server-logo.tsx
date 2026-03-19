import Image from "next/image"

interface ServerLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function ServerLogo({ size = 60, className = "", showText = false }: ServerLogoProps) {
  // Ajustando a altura para manter a proporção correta da nova logo
  const height = showText ? size * 1.2 : size

  return (
    <div className={`relative ${className}`} style={{ width: size, height }}>
      <Image src="/logo.png" alt="SupportBox Logo" fill className="object-contain" priority />
    </div>
  )
}
