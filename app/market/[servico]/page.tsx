'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { listaMunicipios } from '../../data/municipios' // Importe a lista de municípios do arquivo correspondente

export default function CheckoutPage() {
  const { servico } = useParams()
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  
  // Estados de Seleção
  const [busca, setBusca] = useState('')
  const [municipioSelecionado, setMunicipioSelecionado] = useState<{nome: string, codigo: string} | null>(null)
  const [vocacaoSelecionada, setVocacaoSelecionada] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  // Opções de Vocação Comercial (Alinhadas aos nomes dos seus arquivos HTML)
const opcoesVocacao = [
  { id: 'academia', label: 'Academia' },
  { id: 'banco', label: 'Agência Bancária' },
  { id: 'auto', label: 'Automotivo / Peças' },
  { id: 'clinica', label: 'Clínica Médica' },
  { id: 'escola', label: 'Educação / Escolas' },
  { id: 'farmacia', label: 'Farmácia' },
  { id: 'gastronomia', label: 'Gastronomia / Restaurantes' },
  { id: 'hortifruti', label: 'Hortifruti' },
  { id: 'moda', label: 'Moda / Vestuário' },
  { id: 'padaria', label: 'Padaria' },
  { id: 'petshop', label: 'Pet Shop' },
  { id: 'postocombustivel', label: 'Posto de Combustível' },
  { id: 'servicos', label: 'Serviços Gerais' },
  { id: 'supermercado', label: 'Supermercado' }
];
  // Filtro de Municípios
  const sugestoes = useMemo(() => {
    if (busca.length < 3) return []
    return listaMunicipios
      .filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()))
      .slice(0, 5)
  }, [busca])

  // Construção Dinâmica do Link: CodMunicipio_Vocacao_lgbc_mapa.html
  const linkMapa = municipioSelecionado && vocacaoSelecionada 
    ? `/outputs/${municipioSelecionado.codigo}_${vocacaoSelecionada}_lgbc_mapa.html` 
    : '#'

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 font-alegreya">
      <div className="max-w-2xl mx-auto px-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        
        {step === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold text-[#303030] mb-6">Configuração da Análise</h1>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
              
              {/* 1. Seleção de Município (Autocomplete) */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Cidade</label>
                <input 
                  required
                  type="text"
                  placeholder="Ex: São Caetano do Sul..."
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={municipioSelecionado ? municipioSelecionado.nome : busca}
                  onChange={(e) => {
                    setBusca(e.target.value)
                    setMunicipioSelecionado(null)
                    setMostrarSugestoes(true)
                  }}
                />
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl">
                    {sugestoes.map((m) => (
                      <li 
                        key={m.codigo}
                        onClick={() => { setMunicipioSelecionado(m); setMostrarSugestoes(false); }}
                        className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between border-b border-gray-50 last:border-none"
                      >
                        <span className="font-bold">{m.nome}</span>
                        <span className="text-[10px] text-gray-400">{m.codigo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 2. Seleção de Vocação Comercial */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Vocação Comercial</label>
                <select 
                  required
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-cintelYellow"
                  value={vocacaoSelecionada}
                  onChange={(e) => setVocacaoSelecionada(e.target.value)}
                >
                  <option value="">Selecione o segmento...</option>
                  {opcoesVocacao.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button 
                disabled={!municipioSelecionado || !vocacaoSelecionada}
                type="submit" 
                className="w-full bg-[#303030] text-white py-5 rounded-2xl font-bold hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 transition-all mt-4"
              >
                Prosseguir para Pagamento
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="text-center animate-in zoom-in-95">
            <h2 className="text-3xl font-bold mb-8">Checkout</h2>
            <div className="bg-gray-50 p-8 rounded-3xl mb-8 border border-gray-100">
              <p className="text-gray-600 mb-1">{municipioSelecionado?.nome} • {vocacaoSelecionada.toUpperCase()}</p>
              <p className="text-5xl font-extrabold text-[#303030] tracking-tighter">R$ 1.490,00</p>
            </div>
            <button onClick={() => setStep('success')} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold hover:bg-green-700 shadow-md">
              Confirmar Pagamento
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center animate-in fade-in">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#303030]">Análise Concluída!</h2>
            <p className="text-gray-600 mb-10 leading-relaxed px-4">
              O dashboard de <strong>{vocacaoSelecionada}</strong> para <strong>{municipioSelecionado?.nome}</strong> já foi liberado pelo nosso algoritmo.
            </p>
            <a 
              href={linkMapa} 
              target="_blank"
              className="w-full flex items-center justify-center gap-3 bg-cintelYellow text-[#303030] py-5 rounded-2xl font-bold hover:shadow-xl transition-all"
            >
              Visualizar Mapa Interativo
            </a>
          </div>
        )}
      </div>
    </section>
  )
}