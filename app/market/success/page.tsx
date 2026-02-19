'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const nome = searchParams.get('nome')
  const codigo = searchParams.get('codigo')
  const vocacao = searchParams.get('vocacao')

  // Monta o nome do arquivo exatamente como o padrão que definimos
  const fileName = `${codigo}_${vocacao}_lgbc_mapa.html`
  const fileUrl = `/outputs/${fileName}`

  return (
    <section className="pt-32 pb-20 min-h-screen bg-[#FDFDFD] font-alegreya">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Pagamento Confirmado
          </span>
          <h1 className="text-4xl font-bold text-[#303030] mt-4">
            Sua Análise de Vocação está Pronta
          </h1>
          <p className="text-gray-500 mt-2">
            Localidade: <span className="text-[#303030] font-bold">{nome}</span> | 
            Segmento: <span className="text-[#303030] font-bold uppercase">{vocacao}</span>
          </p>
        </div>

        {/* Iframe para exibir o mapa interativo diretamente na página */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-10 h-[600px] relative">
          <iframe 
            src={fileUrl} 
            className="w-full h-full border-none"
            title={`Mapa de Vocação - ${nome}`}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-3 border-2 border-[#303030] text-[#303030] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            Gerar Recibo (PDF)
          </button>
          
          <Link 
            href="/market"
            className="flex items-center justify-center gap-3 bg-[#303030] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Realizar Nova Análise
          </Link>
        </div>
      </div>
    </section>
  )
}