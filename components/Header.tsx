import Image from 'next/image'

export default function Header(){
  return (
    /* Removi o shadow-md e adicionei border-none para garantir que não haja linhas residuais */
    <header className="bg-[#303030] fixed top-0 left-0 w-full z-50 border-none">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        <a href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Image src="/icons/Logo.png" alt="Cintel" width={150} height={40} priority />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#quem-somos" className="text-sm font-semibold text-white hover:text-cintelYellow transition-colors uppercase tracking-wider">Quem Somos</a>
          <a href="/#servicos" className="text-sm font-semibold text-white hover:text-cintelYellow transition-colors uppercase tracking-wider">Serviços</a>
          
          <a href="/market" className="text-sm font-bold text-cintelYellow hover:brightness-110 transition-all uppercase tracking-wider border-b-2 border-cintelYellow pb-1">
            Marketplace
          </a>

          <a href="/blog" className="text-sm font-semibold text-white hover:text-cintelYellow transition-colors uppercase tracking-wider">Blog</a>
          
          <a href="https://wa.me/5511996852374" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white px-5 py-2.5 rounded-full font-bold transform hover:-translate-y-1">
            <img src="/icons/whatsapp.svg" width={18} height={18} alt="WhatsApp" />
            <span>Fale conosco</span>
          </a>
        </nav>

        <div className="md:hidden">
          <a href="https://wa.me/5511996852374" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm">
            <img src="/icons/whatsapp.svg" width={16} height={16} alt="WhatsApp" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}