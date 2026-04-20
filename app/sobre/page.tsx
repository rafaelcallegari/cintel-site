import React from 'react';
import Image from 'next/image';
import { Linkedin, ExternalLink, Award } from 'lucide-react';

export default function SobrePage() {
  return (
    <section className="bg-white pt-32 pb-20 min-h-screen font-alegreya">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Título com Grid para dar um ar moderno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-end">
          <div>
            <span className="text-cintelYellow font-bold uppercase tracking-[0.3em] text-sm">Inteligência Imobiliária</span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-[#303030] mt-4 leading-none">
              Nossa <br /> História
            </h1>
            <div className="h-2 w-32 bg-cintelYellow mt-6"></div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-6">
            "A Cintel nasceu para disruptar o mercado imobiliário comercial no Brasil, unindo ciência de dados à experiência de quem operou no topo do varejo."
          </p>
        </div>

        {/* Bloco Biográfico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          
          <div className="lg:col-span-5 relative group">
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gray-100 rounded-[3rem] group-hover:border-cintelYellow/50 transition-colors duration-500"></div>
            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl bg-gray-100 aspect-[4/5]">
              <Image 
                src="/images/fernando.png" 
                alt="Fernando - Fundador da Cintel"
                fill
                className="object-cover  transition-all duration-700"
              />
            </div>
            
            <a 
              href="https://www.linkedin.com/in/fernando-trambacos-39627351/" 
              target="_blank"
              className="absolute -bottom-6 -right-6 z-20 bg-[#0077b5] text-white p-5 rounded-2xl shadow-xl hover:scale-110 transition-transform"
            >
              <Linkedin size={28} />
            </a>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[#303030] mb-6">A Trajetória do Fundador</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Com forte atuação estratégica em um dos maiores grupos varejistas do país, Fernando liderou a inteligência de mercado e os planos de expansão em um período em que a empresa cresceu mais de 200 lojas.
                </p>
                <p>
                  Sua bagagem inclui a estruturação e transações imobiliárias complexas e de grande porte, unindo a visão de M&A à execução prática no chão do varejo.
                </p>
                <p>
                  A Cintel é o resultado dessa junção: uma visão estratégica de mercado, aliada a uma tecnologia proprietária de ponta.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Cards de Propósito com Inversão de Cores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-12 rounded-[3rem] relative overflow-hidden group">
            <Award className="absolute -right-8 -bottom-8 text-gray-200 size-40 group-hover:text-cintelYellow/20 transition-colors" />
            <h3 className="text-2xl font-bold mb-6 text-[#303030] relative z-10">Propósito Urbano</h3>
            <p className="text-gray-600 leading-relaxed italic text-lg relative z-10">
              "Nossa missão é melhorar a relação das pessoas com o espaço urbano por meio do uso de dados, transformando ambientes subutilizados em espaços úteis e agradáveis."
            </p>
          </div>

          <div className="bg-[#303030] p-12 rounded-[3rem] text-white shadow-xl shadow-black/10">
            <h3 className="text-2xl font-bold mb-6 text-cintelYellow">Tecnologia Proprietária</h3>
            <p className="leading-relaxed opacity-90 text-lg">
              Ao contrário de consultorias tradicionais, operamos com modelos proprietários, construímos com a mais avançada tecnologia, que inferem a vocação e cada endereço de maneira robusta e escalável.
            </p>
          </div>
        </div>

        {/* CTA Final Refinado */}
        <div className="mt-24 py-16 bg-gray-50 rounded-[4rem] text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-[#303030] mb-8">Pronto para transformar seu ativo?</h2>
          <a 
            href="/market" 
            className="inline-flex items-center gap-4 bg-cintelYellow text-[#303030] px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Acessar Serviços
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}