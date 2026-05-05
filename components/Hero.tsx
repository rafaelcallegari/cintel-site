"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [title, setTitle] = useState("Cintel Inteligência");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTitle("Decisões Inteligentes para sua Expansão");
        setIsVisible(true);
      }, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hero-title           { animation: heroFadeUp  0.6s ease-out 0s    both; }
        .hero-subtitle        { animation: heroFadeIn  0.6s ease-out 0.2s  both; }
        .hero-ctas-primary    { animation: heroFadeIn  0.6s ease-out 0.4s  both; }
        .hero-ctas-secondary  { animation: heroFadeIn  0.6s ease-out 0.6s  both; }
        .hero-scroll          { animation: heroFadeIn  0.6s ease-out 0.8s  both; }
      `}</style>

      <header className="relative text-white min-h-[600px] h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14">

          <div className="hero-title flex flex-col items-center justify-center min-h-[100px] md:min-h-[150px]">
            <h1
              className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white font-alegreya leading-tight transition-all duration-700 ease-in-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8"
              }`}
            >
              {title}
            </h1>

            <div className="h-1.5 w-24 sm:w-32 bg-cintelYellow mx-auto mb-4 sm:mb-6 origin-center animate-grow-line"></div>
          </div>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 font-alegreya leading-relaxed text-white/80">
            Usamos <strong className="text-white">tecnologia proprietária</strong> para identificar a vocação real de endereços comerciais e garantir o sucesso da sua <strong className="text-white">estratégia de expansão</strong>.
          </p>

          <div className="hero-ctas-primary flex flex-col sm:flex-row justify-center items-center gap-3 mb-3">
            <a
              href="/market/analise-imovel"
              className="w-auto bg-cintelYellow text-gray-800 px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black text-sm sm:text-lg uppercase tracking-wide hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-[0_8px_30px_rgba(221,234,189,0.45)]"
            >
              Buscar vocação do ponto
            </a>
            <a
              href="/market/mapa-de-calor"
              className="w-auto bg-white text-[#303030] px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black text-sm sm:text-lg uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
            >
              Buscar melhores regiões
            </a>
          </div>

          <div className="hero-ctas-secondary flex flex-row justify-center items-center gap-3 mt-2 flex-wrap">
            <a
              href="#analise"
              className="border-2 border-white/30 text-white/80 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
              Analisar meu endereço
            </a>
            <a
              href="https://wa.me/5511996852374"
              className="flex items-center justify-center gap-2 border-2 border-white/30 text-white/80 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
              <img
                src="/icons/whatsapp.svg"
                width={18}
                height={18}
                alt="WhatsApp"
                className="opacity-70 brightness-0 invert"
              />
              <span>Fale conosco</span>
            </a>
          </div>

          <div className="hero-scroll mt-6 sm:mt-8">
            <a href="#servicos" className="inline-block text-white/50 hover:text-white transition-colors group">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                Saiba mais
              </span>
              <svg
                className="mx-auto animate-bounce"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 16l-6-6h12l-6 6z" fill="currentColor" />
              </svg>
            </a>
          </div>

        </div>
      </header>
    </>
  );
}