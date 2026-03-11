'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Header from '../../../components/Header'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const nome = searchParams.get('nome')
  const codigo = searchParams.get('codigo')
  const vocacao = searchParams.get('vocacao')
  
  const [statusPedido, setStatusPedido] = useState<string | null>(null)

  // Se for Mapa de Calor, monta o link do arquivo
  const isMapa = codigo && vocacao;
  const fileName = isMapa ? `${codigo}_${vocacao}_lgbc_mapa.html` : null;
  const fileUrl = fileName ? `/outputs/${fileName}` : null;

  useEffect(() => {
    const processarPedido = async () => {
      if (isMapa) {
        // Auto-liberação para Mapa de Calor
        await supabase
          .from('orders')
          .update({ status: 'Concluído' })
          .eq('file_name', fileName)
          .eq('status', 'Aguardando Pagamento')
        setStatusPedido('Concluído')
      } else {
        // Busca o status atual para Análise Técnica (usamos o 'nome' ou ID se tiver)
        const { data } = await supabase
          .from('orders')
          .select('status')
          .eq('municipio', nome)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        if (data) setStatusPedido(data.status)
      }
    }
    processarPedido()
  }, [codigo, vocacao, fileName, nome, supabase])

  return (
    <main className="min-h-screen bg-[#1a1a1a] font-alegreya text-white">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER DA PÁGINA */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-left">
              <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${statusPedido === 'Concluído' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-cintelYellow/10 text-cintelYellow border-cintelYellow/20'}`}>
                {statusPedido === 'Concluído' ? '✓ Processo Concluído' : 'Pagamento Confirmado'}
              </span>
              <h1 className="text-4xl font-black text-white mt-4 uppercase italic tracking-tighter">
                {nome || 'Análise Técnica'}
              </h1>
              <p className="text-white/40 text-sm uppercase tracking-widest mt-1">
                Serviço: <span className="text-white font-bold">{isMapa ? 'Mapa de Calor' : 'Análise Técnica de Imóvel'}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard" className="bg-white/5 text-white/60 px-6 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all">
                Meu Painel
              </Link>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO DINÂMICO */}
          <div className="bg-[#303030] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden min-h-[60vh] relative flex items-center justify-center">
            
            {isMapa ? (
              /* CENÁRIO 1: MAPA DE CALOR */
              <iframe src={fileUrl} className="w-full h-full border-none absolute inset-0" title="Mapa Cintel" />
            ) : statusPedido === 'Concluído' ? (
              /* CENÁRIO 2: ANÁLISE TÉCNICA CONCLUÍDA */
              <div className="text-center p-10 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  ✓
                </div>
                <h2 className="text-3xl font-black uppercase italic italic tracking-tighter">Relatório Finalizado!</h2>
                <p className="text-white/50 mt-4 max-w-md mx-auto">
                  Sua análise técnica detalhada foi concluída por nossos engenheiros e enviada para o seu e-mail cadastrado.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Link para o PDF - Você deve nomear o PDF como 'nome-da-rua.pdf' na pasta public/outputs/ */}
                  <a 
                    href={`/outputs/analise-${nome?.toLowerCase().replace(/ /g, '-')}.pdf`} 
                    target="_blank"
                    className="bg-cintelYellow text-[#303030] px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all"
                  >
                    👁️ Visualizar Relatório (PDF)
                  </a>
                </div>
              </div>
            ) : (
              /* CENÁRIO 3: ANÁLISE TÉCNICA EM ANDAMENTO */
              <div className="text-center p-10">
                <div className="w-16 h-16 border-4 border-cintelYellow border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <h2 className="text-2xl font-bold uppercase italic italic tracking-tighter">Iniciando Análise Técnica</h2>
                <p className="text-white/40 mt-4 max-w-md mx-auto">
                  Recebemos seu pagamento! Como este serviço requer análise humana, nossa equipe começará a trabalhar agora. Você será notificado por e-mail.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}