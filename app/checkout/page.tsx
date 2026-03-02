'use client'
import { useEffect, useState } from 'react' // Adicionado useState
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Dados de exemplo (substitua pelos estados do seu formulário)
  const [municipio, setMunicipio] = useState({ nome: 'São Caetano do Sul', codigo: '3548807' })
  const [vocacao, setVocacao] = useState('farmacia')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  // FUNÇÃO DE FINALIZAÇÃO
  const handleFinalizarCompra = async () => {
    setLoading(true)
    
    try {
      // 1. Aqui você chamaria sua API de e-mail/pagamento
      
      // 2. Monta os parâmetros para a SuccessPage
      const params = new URLSearchParams({
        nome: municipio.nome,
        codigo: municipio.codigo,
        vocacao: vocacao
      })

      // 3. Redireciona para a página que tem o IFRAME
      router.push(`/market/success?${params.toString()}`)
      
    } catch (error) {
      console.error("Erro ao processar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 min-h-screen bg-[#1a1a1a] text-white p-6 font-alegreya">
      <div className="max-w-2xl mx-auto bg-[#303030] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black uppercase italic mb-8">Finalizar Compra</h1>
        
        <div className="bg-[#1a1a1a] p-6 rounded-2xl mb-8 border border-white/5">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Resumo da Análise</p>
          <p className="text-xl font-bold">{municipio.nome}</p>
          <p className="text-sm text-cintelYellow uppercase font-bold">{vocacao}</p>
        </div>

        <button 
          onClick={handleFinalizarCompra}
          disabled={loading}
          className="w-full bg-cintelYellow text-[#303030] py-5 rounded-2xl font-black hover:scale-[1.02] transition-all uppercase tracking-widest shadow-lg"
        >
          {loading ? 'Processando...' : 'Liberar Acesso ao Mapa'}
        </button>
      </div>
    </div>
  )
}