'use client'

import { useRef, useEffect, useState } from 'react'

export default function RevealOnScroll({ children }: { children: React.ReactNode }){
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (entry.target) obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transform transition-all duration-700 delay-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  )
}
