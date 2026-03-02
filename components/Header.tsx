'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function Header() {
  const [displayUser, setDisplayUser] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false) // Estado para o dropdown
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase.from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (data?.full_name) {
          setDisplayUser(data.full_name)
        } else {
          setDisplayUser(user.email?.split('@')[0] || 'Usuário')
        }
      }
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-[#303030] fixed top-0 left-0 w-full z-50 border-none font-alegreya">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Image src="/icons/Logo.png" alt="Cintel" width={150} height={40} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#quem-somos" className="text-sm font-semibold text-white hover:text-cintelYellow uppercase">Quem Somos</Link>
          <Link href="/market" className="text-sm font-bold text-cintelYellow border-b-2 border-cintelYellow pb-1 uppercase">Marketplace</Link>
          <Link href="/blog" className="text-sm font-semibold text-white hover:text-cintelYellow uppercase tracking-wider">Blog</Link>
          
          {displayUser ? (
            <div className="relative">
              {/* BOTÃO DO USUÁRIO */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 bg-[#404040] px-4 py-2 rounded-lg hover:bg-[#505050] transition-all group"
              >
                <span className="text-sm font-bold text-cintelYellow uppercase tracking-tighter italic">
                  Olá, {displayUser.split(' ')[0]}
                </span>
                <svg 
                  className={`w-4 h-4 text-white/50 transition-transform ${menuOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* LISTA SUSPENSA (DROPDOWN) */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-[#303030] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                      <Link 
                        href="/market" 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/70 hover:bg-white/5 hover:text-cintelYellow transition-all"
                      >
                        🛒 Marketplace
                      </Link>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/70 hover:bg-white/5 hover:text-cintelYellow transition-all"
                      >
                        📊 Minhas Análises
                      </Link>
                      <div className="h-px bg-white/5 my-2 mx-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all text-left"
                      >
                        🚪 Sair da Conta
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/login" className="text-sm font-semibold text-white hover:text-cintelYellow uppercase transition-colors">Entrar</Link>
               <Link href="/register" className="text-sm font-bold bg-cintelYellow text-[#303030] px-4 py-2 rounded-md hover:bg-white uppercase transition-all">Cadastrar</Link>
            </div>
          )}

          <a href="https://wa.me/5511996852374" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white px-5 py-2.5 rounded-full font-bold transform hover:-translate-y-1">
            <img src="/icons/whatsapp.svg" width={18} height={18} alt="WhatsApp" />
            <span>Fale conosco</span>
          </a>
        </nav>
      </div>
    </header>
  )
}