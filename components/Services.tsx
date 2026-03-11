"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // 1. Importado o Link do Next.js

const services = [
  {
    title: 'Inteligência de Mercado',
    description: 'Análise de dados e tendências para apoiar decisões estratégicas e identificar oportunidades de mercado.',
    image: '/images/Mapa_calor.jpg', 
  },
  {
    title: 'Site location e comercialização',
    description: 'Auxílio na escolha de pontos comerciais e suporte completo no processo de comercialização de imóveis.',
    image: '/images/site-location.png',
  }
];

export default function Services() {
  return (
    <section id="servicos" className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#303030] font-alegreya">Nossos Serviços</h2>
          <div className="h-1.5 w-24 bg-cintelYellow mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col gap-16">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-gray-100`}
              >
                {/* Lado da Imagem */}
                <div className="w-full md:w-1/2 h-64 md:h-[350px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay suave */}
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lado do Conteúdo */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#303030] mb-6 font-alegreya">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed font-alegreya">
                    {service.description}
                  </p>
                  
                  {/* Botão de ação ATUALIZADO */}
                  <div className="mt-8">
                    {/* 2. Substituído <button> por <Link> */}
                    <Link 
                      href="/market" 
                      className="inline-block text-sm font-bold uppercase tracking-widest border-b-2 border-cintelYellow pb-1 hover:text-cintelYellow transition-colors"
                    >
                      Saiba mais
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}