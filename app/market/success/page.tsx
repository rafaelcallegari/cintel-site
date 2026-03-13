'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Simulação de delay para garantir que o banco processou o webhook do Stripe
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20 pb-10 font-alegreya">
      <div className="max-w-2xl w-full px-6 text-center">
        
        {/* Ícone de Sucesso Animado */}
        <div className="mb-8 flex justify-center">
          <div className="bg-green-50 p-4 rounded-full animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-[#303030] mb-4">Pagamento Confirmado!</h1>
        <p className="text-xl text-gray-500 mb-12 italic">
          Obrigado, Rafael! Sua solicitação de inteligência já foi recebida e está sendo processada por nossos modelos preditivos.
        </p>

        <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 mb-12 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Próximos Passos</h2>
          
          <div className="space-y-6 text-left">
            <div className="flex gap-4">
              <div className="bg-cintelYellow text-[#303030] w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
              <p className="text-gray-600">Enviamos um recibo detalhado para o e-mail: <strong className="text-[#303030]">{email}</strong></p>
            </div>
            <div className="flex gap-4">
              <div className="bg-cintelYellow text-[#303030] w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
              <p className="text-gray-600">Nossa equipe de dados está gerando sua <strong>Análise de Vocação</strong> personalizada agora mesmo.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-cintelYellow text-[#303030] w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
              <p className="text-gray-600">Você poderá baixar o relatório PDF diretamente no seu painel em até 24h úteis.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-3 bg-[#303030] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl group"
          >
            <FileText size={18} />
            Ir para Meu Painel
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link 
            href="/blog" 
            className="flex items-center justify-center gap-3 bg-white text-[#303030] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-gray-100 hover:border-cintelYellow transition-all"
          >
            Ver Últimos Insights
          </Link>
        </div>

        <p className="mt-12 text-gray-400 text-sm">
          Dúvidas? Entre em contato pelo e-mail suporte@cintel.com.br
        </p>
      </div>
    </main>
  )
}

// O EXPORT PRINCIPAL PRECISA DO SUSPENSE PARA NÃO DAR ERRO NA VERCEL
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cintelYellow"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}