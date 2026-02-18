"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [title, setTitle] = useState("Cintel Inteligência");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Começa o fade-out
      setIsVisible(false);
      
      // Espera a animação de saída terminar (500ms) para trocar o texto e mostrar de novo
      setTimeout(() => {
        setTitle("Decisões Inteligentes para sua Expansão");
        setIsVisible(true);
      }, 500);
      
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-cintelYellow text-black min-h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        {/* Container do Título com altura fixa para evitar saltos */}
        <div className="flex flex-col items-center justify-center min-h-[180px] md:min-h-[220px]">
          <h1
            className={`text-5xl md:text-7xl font-extrabold mb-4 text-[#303030] font-alegreya leading-tight transition-all duration-700 ease-in-out ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 -translate-y-8"
            }`}
          >
            {title}
          </h1>
          
          {/* Linha animada */}
          <div className="h-1.5 w-32 bg-[#303030] mx-auto mb-8 origin-center animate-grow-line"></div>
        </div>

        {/* Parágrafo */}
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-alegreya leading-relaxed text-[#404040]">
          Usamos <strong>tecnologia proprietária</strong> para identificar a vocação real de endereços comerciais e garantir o sucesso da sua <strong>estratégia de expansão</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <a 
            href="#analise" 
            className="w-full sm:w-auto bg-[#303030] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Analisar meu endereço
          </a>

          <a 
            href="https://wa.me/5511996852374" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#303030]/20 text-[#303030] px-8 py-4 rounded-full font-semibold hover:bg-[#303030]/10 transition-colors duration-300"
          >
            <img src="/icons/whatsapp.svg" width={20} height={20} alt="WhatsApp" className="opacity-80" />
            <span>Fale conosco</span>
          </a>
        </div>

        {/* Indicador de Scroll */}
        <div className="mt-16">
          <a href="#servicos" className="inline-block text-[#303030]/60 hover:text-black transition-colors group">
            <span className="text-sm font-semibold uppercase tracking-widest block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Saiba mais</span>
            <svg className="mx-auto animate-bounce" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16l-6-6h12l-6 6z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}