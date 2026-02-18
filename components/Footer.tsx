import Image from 'next/image'

export default function Footer(){
  return (
    <footer className="border-t mt-0 py-6 bg-[#303030]">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Image src="/icons/Logo.png" alt="Cintel" width={120} height={32} />
          <p className="text-sm text-white">© {new Date().getFullYear()} Cintel Inteligência — Todos os direitos reservados.</p>
        </div>
        <div className="flex gap-4 items-center">
          <a className="text-sm text-white hover:text-cintelYellow transition-colors" href="https://wa.me/5511996852374">WhatsApp</a>
          <a className="text-sm text-white hover:text-cintelYellow transition-colors" href="/blog">Blog</a>
          <a className="text-sm text-white hover:text-cintelYellow transition-colors" href="#quem-somos">Quem somos</a>
        </div>
      </div>
    </footer>
  )
}
