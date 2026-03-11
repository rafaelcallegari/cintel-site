'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { listaMunicipios } from '../../data/municipios'

export default function MarketProductPage() {
  const { servico } = useParams()
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
    }
    checkUser()
  }, [router, supabase])

  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [loading, setLoading] = useState(false)

  // Estados dos Dados
  const [estadoSelecionado, setEstadoSelecionado] = useState('')
  const [busca, setBusca] = useState('')
  const [municipioSelecionado, setMunicipioSelecionado] = useState<{nome: string, codigo: string, uf: string} | null>(null)
  const [vocacaoSelecionada, setVocacaoSelecionada] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const listaEstados = useMemo(() => {
    const ufs = listaMunicipios.map(m => m.uf).filter(uf => uf && uf !== 'XX')
    return Array.from(new Set(ufs)).sort()
  }, [])

  const normalizar = (txt: string) => 
    txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const sugestoes = useMemo(() => {
    if (!estadoSelecionado || busca.length < 3) return []
    const buscaNorm = normalizar(busca)
    return listaMunicipios
      .filter(m => m.uf === estadoSelecionado && normalizar(m.nome).includes(buscaNorm))
      .slice(0, 10)
  }, [busca, estadoSelecionado])

  const opcoesVocacao = [
    { id: 'academia', label: 'Academia' }, { id: 'banco', label: 'Agência Bancária' },
    { id: 'auto', label: 'Automotivo' }, { id: 'clinica', label: 'Clínica Médica' },
    { id: 'escola', label: 'Educação' }, { id: 'farmacia', label: 'Farmácia' },
    { id: 'gastronomia', label: 'Gastronomia' }, { id: 'hortifruti', label: 'Hortifruti' },
    { id: 'moda', label: 'Moda' }, { id: 'padaria', label: 'Padaria' },
    { id: 'petshop', label: 'Pet Shop' }, { id: 'postocombustivel', label: 'Posto de Combustível' },
    { id: 'supermercado', label: 'Supermercado' }
  ];

  // --- VERSÃO COMPLETA COM PAGAMENTO STRIPE ATIVADO ---
  const handleFinalizarCompra = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 1. Grava o pedido no banco como "Aguardando Pagamento"
        const { data: orderData, error: dbError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id,
              municipio: municipioSelecionado?.nome,
              uf: estadoSelecionado,
              vocacao: vocacaoSelecionada,
              tipo_produto: 'Mapa de Calor', 
              status: 'Aguardando Pagamento', 
              file_name: `${municipioSelecionado?.codigo}_${vocacaoSelecionada}_lgbc_mapa.html`
            }
          ]).select().single() // Pega os dados do pedido recém-criado

        if (dbError) throw dbError

        // =========================================================
        // 2. CHAMA A API PARA GERAR O LINK DE PAGAMENTO
        // =========================================================
        
        // Monta os parâmetros que vão para a tela de sucesso após pagar
        const params = new URLSearchParams({
          nome: municipioSelecionado?.nome || '',
          codigo: municipioSelecionado?.codigo || '',
          uf: estadoSelecionado,
          vocacao: vocacaoSelecionada
        })

        // Chama a rota de checkout (VERIFIQUE SE A SUA ROTA É EXATAMENTE /api/checkout)
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produto: `Mapa de Calor - ${municipioSelecionado?.nome} / ${estadoSelecionado}`,
            preco: 149000, // R$ 1.490,00 (O Stripe lê em centavos, então 149000 = 1490.00)
            orderId: orderData.id, 
            successUrl: `${window.location.origin}/market/success?${params.toString()}`,
            cancelUrl: window.location.href // Se ele cancelar, volta para a tela de resumo
          })
        });

        const data = await response.json();

        // Se a API devolver a URL do Stripe, redireciona o cliente para lá
        if (data.url) {
          router.push(data.url);
        } else {
          console.error("Erro do Gateway de Pagamento:", data);
          alert("Não foi possível gerar o link de pagamento no momento. Tente novamente.");
        }
      }
    } catch (error: any) {
      console.error("Erro ao processar:", error.message)
      alert("Houve um erro ao gerar o pagamento. Verifique sua conexão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 font-alegreya">
      <div className="max-w-2xl mx-auto px-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>
          {['Configurar', 'Revisar'].map((s, i) => (
            <div key={s} className={`relative z-10 px-4 bg-white text-[10px] font-bold uppercase tracking-widest 
              ${(step === 'form' && i === 0) || (step === 'confirm' && i === 1) ? 'text-cintelYellow' : 'text-gray-300'}`}>
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-[#303030] mb-6">Configuração da Análise</h1>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('confirm'); }}>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">1. Estado (UF)</label>
                <select required className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={estadoSelecionado}
                  onChange={(e) => { setEstadoSelecionado(e.target.value); setMunicipioSelecionado(null); setBusca(''); }}>
                  <option value="">Selecione a UF...</option>
                  {listaEstados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>

              <div className="relative">
                <label className={`text-xs font-bold uppercase mb-2 block tracking-widest ${!estadoSelecionado ? 'text-gray-200' : 'text-gray-400'}`}>2. Cidade</label>
                <input disabled={!estadoSelecionado} required type="text" placeholder={estadoSelecionado ? "Digite o nome da cidade..." : "Selecione o estado primeiro"} 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow transition-all disabled:bg-gray-50"
                  value={municipioSelecionado ? municipioSelecionado.nome : busca}
                  onChange={(e) => { setBusca(e.target.value); setMunicipioSelecionado(null); setMostrarSugestoes(true); }}
                />
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {sugestoes.map((m) => (
                      <li key={m.codigo} onClick={() => { setMunicipioSelecionado(m); setMostrarSugestoes(false); }} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between border-b border-gray-50 last:border-none">
                        <span className="font-bold text-[#303030]">{m.nome}</span>
                        <span className="text-[10px] text-gray-400 uppercase">IBGE: {m.codigo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">3. Vocação Comercial</label>
                <select required className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={vocacaoSelecionada} onChange={(e) => setVocacaoSelecionada(e.target.value)}>
                  <option value="">Selecione o segmento...</option>
                  {opcoesVocacao.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>

              <button disabled={!municipioSelecionado || !vocacaoSelecionada} type="submit" 
                className="w-full bg-[#303030] text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg uppercase tracking-widest">
                Revisar Pedido
              </button>
            </form>
          </div>
        )}

        {step === 'confirm' && (
          <div className="text-center animate-in zoom-in-95">
            <h2 className="text-3xl font-bold mb-8 text-[#303030]">Resumo da Análise</h2>
            <div className="bg-gray-50 p-8 rounded-3xl mb-8 border border-gray-100 text-left">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 italic">Item Selecionado</p>
              <p className="text-xl font-bold text-[#303030]">{municipioSelecionado?.nome} - {estadoSelecionado}</p>
              <p className="text-sm text-gray-500 mb-6">Vocação Comercial: <span className="capitalize">{vocacaoSelecionada}</span></p>
              <div className="h-px bg-gray-200 w-full mb-6"></div>
              <p className="text-5xl font-extrabold text-[#303030] tracking-tighter text-center italic">R$ 1.490,00</p>
            </div>
            
            <button onClick={handleFinalizarCompra} disabled={loading}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {loading ? 'Processando...' : 'Confirmar e Ir para Pagamento'}
            </button>
            <button onClick={() => setStep('form')} className="mt-4 text-xs text-gray-400 hover:underline">Voltar e editar dados</button>
          </div>
        )}
      </div>
    </section>
  )
}