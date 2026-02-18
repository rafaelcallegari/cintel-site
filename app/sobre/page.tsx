import React from 'react';
import Image from 'next/image';
import { Linkedin, ExternalLink } from 'lucide-react'; // Instale lucide-react para ícones

export default function SobrePage() {
  return (
    <section className="bg-white pt-32 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Título Principal com Estilo */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#303030] font-alegreya mb-4">
            Nossa História
          </h1>
          <div className="h-2 w-32 bg-cintelYellow"></div>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl font-alegreya leading-relaxed">
            A Cintel nasceu para disruptar o mercado imobiliário comercial no Brasil, unindo o rigor da ciência de dados à experiência prática de quem já operou no topo do varejo.
          </p>
        </div>

        {/* Bloco Biográfico do Fernando */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Coluna da Imagem */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-cintelYellow rounded-[3rem] z-0"></div>
            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl bg-gray-100 aspect-[4/5]">
              <Image 
                src="/images/fernando.png" 
                alt="Fernando - Fundador da Cintel"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Social Links sobre a imagem ou abaixo */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-3">
              <a 
                href="https://www.linkedin.com/in/fernando-trambacos-39627351/" 
                target="_blank"
                className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform text-[#0077b5]"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Coluna de Texto Profissional */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold text-[#303030] font-alegreya">A Trajetória do Fundador</h2>
            <div className="space-y-4 text-lg text-gray-700 font-alegreya leading-relaxed">
              <p>
                Com mais de 7 anos de atuação estratégica no <strong>Grupo Pão de Açúcar (GPA)</strong>, Fernando liderou a inteligência de mercado e planos de expansão em um período onde a empresa se consolidou como o 5º maior operador de área locável do país.
              </p>
              <p>
                Sua bagagem inclui a estruturação de transações imobiliárias complexas de <strong>centenas de milhões de reais</strong>, unindo a visão de M&A à execução prática no chão do varejo. 
              </p>
              <p>
                A Cintel é o resultado dessa junção: uma visão estratégica do mercado aliada à capacidade de execução de negócios complexos.
              </p>
            </div>
          </div>
        </div>

        {/* Missão e Tecnologia - Grid Inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border-t-8 border-cintelYellow">
            <h3 className="text-2xl font-bold mb-4 font-alegreya text-[#303030]">Propósito Urbano</h3>
            <p className="text-gray-600 font-alegreya leading-relaxed italic">
              "Nossa missão é melhorar a relação das pessoas com o espaço urbano por meio do uso de dados, transformando ambientes subutilizados em espaços úteis e agradáveis."
            </p>
          </div>

          <div className="bg-[#303030] p-10 rounded-[2.5rem] text-white">
            <h3 className="text-2xl font-bold mb-4 font-alegreya text-cintelYellow">Ciência Proprietária</h3>
            <p className="font-alegreya leading-relaxed opacity-90">
              Diferente de consultorias tradicionais, operamos com modelos estatísticos próprios que inferem a vocação de cada endereço de maneira robusta e escalável.
            </p>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-20 text-center">
          <a 
            href="/market" 
            className="inline-flex items-center gap-3 bg-cintelYellow text-[#303030] px-10 py-4 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Conheça nossas soluções tecnológicas
            <ExternalLink size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}