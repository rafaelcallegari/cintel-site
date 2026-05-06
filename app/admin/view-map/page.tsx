'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const R2_PUBLIC_URL = 'https://pub-9fcabaac4f384770a5bef6c3d49ebaca.r2.dev'

export default function AdminViewMap() {
  const searchParams = useSearchParams()
  const file = searchParams.get('file')

  if (!file) return <div className="pt-40 text-center uppercase font-bold">Arquivo não especificado.</div>

  return (
    <main className="min-h-screen bg-[#303030] pt-24 flex flex-col">
      <div className="bg-[#252525] px-6 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/admin/pedidos" className="text-white/50 hover:text-cintelYellow transition-colors text-xs font-bold uppercase tracking-widest">
            ← Voltar para Pedidos
          </Link>
          <span className="h-4 w-px bg-white/10"></span>
          <h1 className="text-white text-sm font-bold truncate max-w-md italic">{file}</h1>
        </div>
        
        <a 
          href={`${R2_PUBLIC_URL}/${file}`} 
          download 
          className="bg-cintelYellow text-[#303030] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter hover:bg-white transition-all"
        >
          Baixar HTML
        </a>
      </div>

      <div className="flex-grow bg-white relative">
        <iframe 
          src={`${R2_PUBLIC_URL}/${file}`} 
          className="absolute inset-0 w-full h-full border-none"
          title="Visualização do Mapa Cintel"
        />
      </div>
    </main>
  )
}