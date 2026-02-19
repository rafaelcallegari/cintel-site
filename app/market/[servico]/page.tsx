'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { listaMunicipios } from '../../data/municipios'

export default function CheckoutPage() {
  const { servico } = useParams()
  
  // Estados do Fluxo
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  const [loading, setLoading] = useState(false)

  // Estados dos Dados
  const [busca, setBusca] = useState('')
  const [municipioSelecionado, setMunicipioSelecionado] = useState<{nome: string, codigo: string} | null>(null)
  const [vocacaoSelecionada, setVocacaoSelecionada] = useState('')
  const [email, setEmail] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const opcoesVocacao = [
    { id: 'academia', label: 'Academia' },
    { id: 'banco', label: 'Agência Bancária' },
    { id: 'auto', label: 'Automotivo' },
    { id: 'clinica', label: 'Clínica Médica' },
    { id: 'escola', label: 'Educação' },
    { id: 'farmacia', label: 'Farmácia' },
    { id: 'gastronomia', label: 'Gastronomia' },
    { id: 'hortifruti', label: 'Hortifruti' },
    { id: 'moda', label: 'Moda' },
    { id: 'padaria', label: 'Padaria' },
    { id: 'petshop', label: 'Pet Shop' },
    { id: 'postocombustivel', label: 'Posto de Combustível' },
    { id: 'supermercado', label: 'Supermercado' }
  ];

  // Filtro de Municípios (Otimizado)
  const sugestoes = useMemo(() => {
    if (busca.length < 3) return []
    return listaMunicipios
      .filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()))
      .slice(0, 5)
  }, [busca])

  const fileName = `${municipioSelecionado?.codigo}_${vocacaoSelecionada}_lgbc_mapa.html`
  const linkMapa = `/outputs/${fileName}`

  // Função para chamar a API do Resend e avançar para o sucesso
  const handleFinalizarCompra = async () => {
    setLoading(true)
    
    // Chamada para a API que você criou em /api/send
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          municipio: municipioSelecionado?.nome,
          vocacao: vocacaoSelecionada,
          link: linkMapa
        }),
      })
    } catch (error) {
      console.error("Erro ao enviar e-mail, mas prosseguindo com a liberação...", error)
    }

    setLoading(false)
    setStep('success')
  }

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 font-alegreya">
      <div className="max-w-2xl mx-auto px-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        
        {/* Progress Tracker */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>
          {['Dados', 'Pagamento', 'Acesso'].map((s, i) => (
            <div key={s} className={`relative z-10 px-4 bg-white text-[10px] font-bold uppercase tracking-widest 
              ${(step === 'form' && i === 0) || (step === 'payment' && i === 1) || (step === 'success' && i === 2) 
              ? 'text-cintelYellow' : 'text-gray-300'}`}>
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-[#303030] mb-6">Configuração da Análise</h1>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
              
              <div className="relative">
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Cidade de Análise</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Ex: São Caetano do Sul..." 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
                  value={municipioSelecionado ? municipioSelecionado.nome : busca}
                  onChange={(e) => { setBusca(e.target.value); setMunicipioSelecionado(null); setMostrarSugestoes(true); }}
                />
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl overflow-hidden">
                    {sugestoes.map((m) => (
                      <li key={m.codigo} onClick={() => { setMunicipioSelecionado(m); setMostrarSugestoes(false); }} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between border-b border-gray-50 last:border-none">
                        <span className="font-bold text-[#303030]">{m.nome}</span>
                        <span className="text-[10px] text-gray-400">IBGE: {m.codigo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Vocação Comercial</label>
                <select 
                  required 
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={vocacaoSelecionada} 
                  onChange={(e) => setVocacaoSelecionada(e.target.value)}
                >
                  <option value="">Selecione o segmento...</option>
                  {opcoesVocacao.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">E-mail para Entrega</label>
                <input 
                  required 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                disabled={!municipioSelecionado || !vocacaoSelecionada} 
                type="submit" 
                className="w-full bg-[#303030] text-white py-5 rounded-2xl font-bold hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg"
              >
                Confirmar Dados
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="text-center animate-in zoom-in-95">
            <h2 className="text-3xl font-bold mb-8 text-[#303030]">Checkout de Análise</h2>
            <div className="bg-gray-50 p-8 rounded-3xl mb-8 border border-gray-100 text-left">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 italic">Resumo do Pedido</p>
              <p className="text-xl font-bold text-[#303030]">{municipioSelecionado?.nome}</p>
              <p className="text-sm text-gray-500 mb-6">Vocação Comercial: <span className="capitalize">{vocacaoSelecionada}</span></p>
              <div className="h-px bg-gray-200 w-full mb-6"></div>
              <p className="text-5xl font-extrabold text-[#303030] tracking-tighter">R$ 1.490,00</p>
            </div>
            
            <button 
              onClick={handleFinalizarCompra} 
              disabled={loading}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-3"
            >
              {loading ? 'Processando...' : 'Confirmar e Liberar Acesso'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center animate-in fade-in">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#303030]">Análise Liberada!</h2>
            <p className="text-gray-600 mb-10 leading-relaxed px-4">
              Enviamos o link do dashboard para <strong>{email}</strong>. Você também pode acessar e baixar o arquivo agora:
            </p>
            
            <div className="space-y-4">
              <a href={linkMapa} target="_blank" className="w-full flex items-center justify-center gap-3 bg-cintelYellow text-[#303030] py-5 rounded-2xl font-bold hover:shadow-xl transition-all">
                Abrir Mapa Interativo
              </a>
              <a href={linkMapa} download={fileName} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                Baixar Arquivo HTML
              </a>
              <button onClick={() => window.print()} className="w-full text-xs text-gray-400 hover:underline">
                Gerar Recibo da Transação
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}