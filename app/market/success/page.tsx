'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const nome = searchParams.get('nome')
  const codigo = searchParams.get('codigo')
  const vocacao = searchParams.get('vocacao')

  // Monta o nome do arquivo exatamente como o padrão definido
  const fileName = `${codigo}_${vocacao}_lgbc_mapa.html`
  const fileUrl = `/outputs/${fileName}`

  return (
    <main className="min-h-screen bg-[#1a1a1a] font-alegreya">
      <Header /> {/* Mantém o acesso ao menu e nome do usuário */}
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-left">
              <span className="bg-cintelYellow/10 text-cintelYellow px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-cintelYellow/20">
                Análise Liberada
              </span>
              <h1 className="text-4xl font-black text-white mt-4 uppercase italic italic tracking-tighter">
                {nome}
              </h1>
              <p className="text-white/40 text-sm uppercase tracking-widest mt-1">
                Segmento: <span className="text-white font-bold">{vocacao}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 border border-white/10 text-white/60 px-6 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/5 transition-all"
              >
                Imprimir Recibo
              </button>
              <Link 
                href="/market"
                className="flex items-center justify-center gap-3 bg-cintelYellow text-[#303030] px-6 py-3 rounded-xl text-xs font-black uppercase hover:scale-[1.02] transition-all"
              >
                Nova Análise
              </Link>
            </div>
          </div>

          {/* Iframe para exibir o mapa interativo internamente */}
          <div className="bg-[#303030] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden h-[75vh] relative group">
            <iframe 
              src={fileUrl} 
              className="w-full h-full border-none"
              title={`Mapa de Vocação - ${nome}`}
            />
            {/* Overlay sutil para indicar interação */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-[#1a1a1a]/80 text-white text-[10px] px-3 py-1 rounded-full uppercase font-bold backdrop-blur-sm">
                Mapa Interativo
              </span>
            </div>
          </div>

          <p className="text-center text-white/20 text-[10px] uppercase font-bold tracking-[0.3em] mt-8">
            Cintel Inteligência de Mercado &copy; 2026 - Todos os direitos reservados
          </p>
        </div>
      </section>
    </main>
  )
}