'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ViewMapContent() {
  const searchParams = useSearchParams()
  const file = searchParams.get('file')

  if (!file) return <div className="pt-40 text-center uppercase font-bold">Arquivo não especificado.</div>

  return (
    <main className="min-h-screen bg-[#303030] pt-24 flex flex-col">
      <div className="bg-[#252525] px-6 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-white/50 hover:text-cintelYellow transition-colors text-xs font-bold uppercase tracking-widest">
            ← Voltar para Minhas Análises
          </Link>
          <span className="h-4 w-px bg-white/10"></span>
          <h1 className="text-white text-sm font-bold truncate max-w-md italic">{file}</h1>
        </div>
      </div>

      <div className="flex-grow bg-white relative">
        <iframe 
          src={`/outputs/${file}`} 
          className="absolute inset-0 w-full h-full border-none"
          title="Visualização do Mapa Cintel"
        />
      </div>
    </main>
  )
}
