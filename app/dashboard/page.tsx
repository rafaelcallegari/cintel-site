'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Header from '../../components/Header'
import Link from 'next/link'

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error) setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [supabase])

  return (
    <main className="min-h-screen bg-[#1a1a1a] font-alegreya text-white">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Minhas Análises</h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.3em] mt-2">Histórico de Inteligência de Mercado</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cintelYellow"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => {
                const isLiberado = order.status === 'Concluído';
                
                // NOVA LÓGICA: Verifica se o arquivo é um link externo (PDF do Storage)
                const isPDF = order.file_name?.startsWith('http');

                return (
                  <div key={order.id} className="bg-[#303030] p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-cintelYellow/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-cintelYellow text-[10px] font-bold uppercase tracking-widest bg-cintelYellow/10 px-3 py-1 rounded-full border border-cintelYellow/20">
                          {order.uf || 'BR'}
                        </span>
                        <h2 className="text-2xl font-bold mt-3 leading-tight uppercase italic">{order.municipio}</h2>
                      </div>
                      
                      <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${isLiberado ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mb-8">
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Vocação Comercial</p>
                      <p className="text-lg font-medium capitalize">{order.vocacao}</p>
                    </div>

                    {isLiberado ? (
                      isPDF ? (
                        /* BOTÃO PARA PDF: Abre o link do Storage diretamente */
                        <a 
                          href={order.file_name} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center bg-white text-[#1a1a1a] py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cintelYellow transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                          📥 Baixar Relatório PDF
                        </a>
                      ) : (
                        /* BOTÃO PARA MAPA: Segue o fluxo da página de sucesso */
                        <Link 
                          href={`/market/success?nome=${order.municipio}&codigo=${order.file_name?.split('_')[0]}&vocacao=${order.vocacao}`}
                          className="w-full flex items-center justify-center bg-cintelYellow text-[#1a1a1a] py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(255,230,0,0.2)]"
                        >
                          🚀 Acessar Inteligência
                        </Link>
                      )
                    ) : (
                      <div className="w-full flex items-center justify-center bg-white/5 text-white/20 py-4 rounded-xl font-black uppercase text-xs tracking-widest cursor-not-allowed border border-white/5">
                        {order.status === 'Aguardando Pagamento' ? '🔒 Aguardando Pagamento' : '⏳ Processando Análise...'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-[#303030] rounded-[3rem] border-2 border-dashed border-white/5">
              <p className="text-white/20 text-xl font-bold uppercase tracking-widest">Você ainda não possui análises contratadas.</p>
              <Link href="/market" className="inline-block mt-8 text-cintelYellow font-black uppercase text-xs hover:underline">
                Explorar Marketplace →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}