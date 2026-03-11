'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AnaliseImovelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  const [formData, setFormData] = useState({
    endereco: '',
    areaConstruida: '',
    areaTerreno: '',
    descricao: '',
    email: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 1. GRAVA O PEDIDO NO BANCO (Antes de ir para o Stripe)
      // Isso garante que o pedido apareça no Admin e no Dashboard do cliente
      const { data: orderData, error: dbError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            municipio: formData.endereco, // Usando o endereço como identificador
            vocacao: "Análise Técnica de Imóvel",
            tipo_produto: 'Análise de Vocação', 
            status: 'Aguardando Pagamento',
            file_name: 'analise_tecnica_pendente' // Marcador para o sistema saber que não é mapa automático
          }
        ]).select().single()

      if (dbError) throw dbError

      // 2. CHAMA O CHECKOUT DO STRIPE
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          municipio: formData.endereco,
          vocacao: "Análise Técnica de Imóvel",
          areaConstruida: formData.areaConstruida,
          areaTerreno: formData.areaTerreno,
          descricao: formData.descricao,
          orderId: orderData.id // Enviando o ID gerado para referência
        }),
      })

      const session = await response.json()

      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Erro ao gerar a sessão de checkout.');
      }
    } catch (error: any) {
      console.error("Erro no processo:", error)
      alert('Ocorreu um erro ao processar seu pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 font-alegreya">
      <div className="max-w-2xl mx-auto px-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="mb-10 text-center">
          <span className="text-cintelYellow font-bold uppercase text-[10px] tracking-[0.3em]">Serviço de Engenharia</span>
          <h1 className="text-3xl font-bold text-[#303030] mt-2">Análise de Ativo Específico</h1>
          <p className="text-gray-400 mt-2">Informe os detalhes técnicos para análise de vocação.</p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Endereço do Imóvel</label>
              <input required name="endereco" value={formData.endereco} onChange={handleChange} type="text" placeholder="Rua, número, bairro..." className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Área Const. (m²)</label>
                <input required name="areaConstruida" value={formData.areaConstruida} onChange={handleChange} type="number" placeholder="Ex: 200" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cintelYellow outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Área Terreno (m²)</label>
                <input required name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} type="number" placeholder="Ex: 450" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cintelYellow outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Descrição e Diferenciais</label>
              <textarea required name="descricao" value={formData.descricao} onChange={handleChange} rows={4} placeholder="Ex: Galpão logístico, pé direito alto, transformador próprio..." className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cintelYellow outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">E-mail para Relatório</label>
              <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="contato@empresa.com" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cintelYellow outline-none" />
            </div>
          </div>

          <div className="bg-[#303030] p-8 rounded-3xl text-white mt-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="opacity-60 text-sm font-bold uppercase tracking-widest">Investimento da Análise</span>
              <span className="text-3xl font-black italic">R$ 2.490,00</span>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cintelYellow text-[#303030] py-5 rounded-2xl font-black hover:bg-white hover:scale-[1.02] transition-all shadow-lg flex justify-center disabled:opacity-50 uppercase tracking-widest">
              {loading ? 'Processando Registro...' : 'CONTRATAR AGORA'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}