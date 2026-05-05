'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, FileText, Mail } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'seu e-mail cadastrado'
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) return
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
  }, [sessionId])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20 pb-10 font-alegreya">
      <div className="max-w-2xl w-full px-6 text-center">
        
        {/* Ícone de Sucesso */}
        <div className="mb-8 flex justify-center">
          <div className="bg-green-50 p-6 rounded-full animate-in zoom-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-[#303030] mb-4 tracking-tighter">Pagamento Confirmado!</h1>
        <p className="text-xl text-gray-500 mb-12 italic">
          Obrigado! Sua solicitação de inteligência já foi recebida e nossos modelos preditivos iniciaram o processamento.
        </p>

        <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 mb-12 shadow-sm text-left relative overflow-hidden">
          {/* Decoração de fundo */}
          <Mail className="absolute -right-4 -bottom-4 text-gray-100 w-32 h-32 rotate-12" />
          
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-200"></span>
            Próximos Passos
          </h2>
          
          <div className="space-y-8 relative z-10">
            <div className="flex gap-5">
              <div className="bg-cintelYellow text-[#303030] w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Confirmação</p>
                <p className="text-gray-600">Enviamos os detalhes do pedido para: <strong className="text-[#303030]">{email}</strong></p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="bg-cintelYellow text-[#303030] w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Processamento</p>
                <p className="text-gray-600">Nossa equipe de dados está gerando sua <strong>Análise de Vocação</strong> personalizada.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="bg-cintelYellow text-[#303030] w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-sm">3</div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Entrega</p>
                <p className="text-gray-600">O relatório PDF estará disponível no seu painel em até <strong className="text-[#303030]">24h úteis</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-3 bg-[#303030] text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-2xl group"
          >
            <FileText size={16} />
            Acessar Meu Painel
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link 
            href="/blog" 
            className="flex items-center justify-center gap-3 bg-white text-[#303030] px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-2 border-gray-100 hover:border-cintelYellow transition-all"
          >
            Ler Insights do Blog
          </Link>
        </div>

        <p className="mt-16 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
          Dúvidas? suporte@cintel.com.br
        </p>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cintelYellow"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}