"use client"

import { useEffect, useRef } from "react"

export default function ThreeDScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight
    containerRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d", { alpha: true }) // enable transparency
    if (!ctx) return

    let animationId: number

    const animate = () => {
      // Clear canvas while keeping transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw animated black waveform/circles
      const time = Date.now() * 0.001
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 4; i++) {
        const radius = 50 + i * 40 + Math.sin(time + i) * 20
        const opacity = 0.4 - i * 0.1
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = containerRef.current?.clientWidth || 0
      canvas.height = containerRef.current?.clientHeight || 0
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      canvas.remove()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full rounded-3xl overflow-hidden" />
}
