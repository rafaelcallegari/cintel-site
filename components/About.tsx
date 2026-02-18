'use client'

import { useState, useRef } from 'react'

// 1. Definição do InfoCard
const InfoCard = ({ icon, title, text, isActive, onMouseEnter, onMouseLeave, isAnyHovered }: any) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        bg-cintelYellow rounded-[2.5rem] p-10 md:p-12 
        transition-all duration-500 ease-in-out
        flex flex-col items-center justify-center cursor-pointer
        w-full flex-1
        ${isActive ? 'scale-105 shadow-[0_20px_50px_rgba(234,255,0,0.3)] z-10' : isAnyHovered ? 'scale-95 opacity-60' : 'scale-100'}
      `}
    >
      <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}>
        <img src={icon} alt={title} width={64} height={64} className="mb-6" />
      </div>
      <h3 className="font-bold text-xl text-center text-[#303030] mb-2 font-alegreya">{title}</h3>
      
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isActive ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
        <p className="text-[#303030]/90 text-sm md:text-base text-center leading-relaxed font-alegreya">
          {text}
        </p>
      </div>
    </div>
  )
}

// 2. Componente Principal
export default function About() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    // Se o usuário voltar para um card, cancelamos o timer de sumir
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoverIndex(index);
    setIsButtonVisible(true);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    // Janela de 7 segundos (7000ms) para o usuário interagir com o Marketplace
    timeoutRef.current = setTimeout(() => {
      setIsButtonVisible(false);
    }, 7000); 
  };

  const cards = [
    {
      title: "Nossa Missão",
      icon: "/icons/missao.png",
      text: "Fornecer soluções robustas e eficazes para empresas em expansão e donos de imóveis buscando ocupantes qualificados."
    },
    {
      title: "Nossa Tecnologia",
      icon: "/icons/technology.png",
      text: "Desenvolvemos tecnologia proprietária, baseada em modelos sofisticados de inteligência artificial, para determinar a vocação de cada endereço."
    },
    {
      title: "Nossa Abordagem",
      icon: "/icons/comunicacao.png",
      text: "Alinhamos recomendações às necessidades dos clientes e à realidade local, combinando ciência de dados e experiência prática."
    }
  ];

  return (
    <section id="quem-somos" className="bg-white py-24 min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full text-center">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#303030] font-alegreya">Quem Somos</h2>
          <div className="h-1.5 w-24 bg-cintelYellow mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mb-16">
          {cards.map((card, index) => (
            <InfoCard
              key={index}
              {...card}
              isActive={hoverIndex === index}
              isAnyHovered={hoverIndex !== null}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>

        {/* CTA do Marketplace com persistência de 7 segundos */}
        <div 
          onMouseEnter={() => { 
            // Se o mouse entrar no botão, ele não some nunca
            if (timeoutRef.current) clearTimeout(timeoutRef.current); 
          }}
          onMouseLeave={() => {
            // Se o mouse sair do botão, ele espera os 7 segundos para sumir
            timeoutRef.current = setTimeout(() => setIsButtonVisible(false), 7000);
          }}
          className={`
            flex justify-center transition-all duration-700
            ${isButtonVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}
          `}
        >
          <a 
            href="/market" 
            className="group flex items-center gap-4 text-[#303030] font-bold text-lg hover:text-black transition-all bg-cintelYellow/10 px-10 py-5 rounded-full border-2 border-cintelYellow shadow-lg hover:bg-cintelYellow/20"
          >
            <span>Descubra como podemos ajudar sua empresa</span>
            <div className="bg-[#303030] text-white p-1 rounded-full group-hover:translate-x-2 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}