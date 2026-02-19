'use client'

import Link from 'next/link'

const produtos = [
  {
    id: 1,
    slug: "analise-imovel", // Atualizado para bater com a pasta app/market/analise-imovel
    categoria: "Motor de Inteligência",
    titulo: "Análise de Vocação",
    descricao: "Identifique o potencial real de qualquer endereço comercial através de modelos preditivos baseados em dados proprietários.",
    tags: ["Site Selection", "Dados Reais", "Pragmatismo"],
    cta: "Analisar Endereço"
  },
  {
    id: 2,
    slug: "mapa-de-calor", 
    categoria: "Geomarketing",
    titulo: "Mapa de Calor",
    descricao: "Visualize densidade demográfica, fluxo de consumo e áreas de influência para decisões rápidas de expansão.",
    tags: ["SaaS", "Visualização", "Agilidade"],
    cta: "Ver Mapa de Calor"
  }
];

export default function MarketplacePage() {
  return (
    <section className="mt-16 py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header do Marketplace */}
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-[#303030] font-alegreya mb-4">Marketplace de Inteligência</h1>
            <p className="text-gray-600 text-lg">
              Soluções tecnológicas para o mercado imobiliário comercial.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
             <span className="bg-cintelYellow font-bold px-4 py-1 rounded-full text-sm">NOVIDADE</span>
             <span className="bg-[#303030] text-white font-bold px-4 py-1 rounded-full text-sm">TECH ENABLED</span>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {produtos.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.categoria}</span>
                <h3 className="text-3xl font-bold text-[#303030] mt-3 mb-5 font-alegreya">{p.titulo}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {p.descricao}
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Botão Dinâmico */}
              <Link 
                href={`/market/${p.slug}`}
                className="w-full bg-[#303030] text-white py-5 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 group text-center"
              >
                {p.cta}
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}