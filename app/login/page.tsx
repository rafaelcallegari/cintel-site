'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false) // Estado para o reset

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('Erro: ' + error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  // Função para disparar o e-mail de recuperação
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Por favor, digite seu e-mail no campo acima primeiro.")
      return
    }

    setResetLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`, // Página que criaremos a seguir
    })

    if (error) {
      alert("Erro: " + error.message)
    } else {
      alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.")
    }
    setResetLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-[#303030] w-full max-w-md p-10 rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic text-center">Entrar</h1>
        <div className="flex flex-col gap-5">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full p-4 bg-[#404040] rounded-xl text-white outline-none focus:ring-2 focus:ring-cintelYellow" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <div className="flex flex-col gap-2">
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-4 bg-[#404040] rounded-xl text-white outline-none focus:ring-2 focus:ring-cintelYellow" 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            {/* Botão Esqueci minha Senha */}
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-[10px] text-white/40 uppercase font-bold tracking-widest hover:text-cintelYellow text-right transition-colors"
            >
              {resetLoading ? 'Enviando...' : 'Esqueci minha senha'}
            </button>
          </div>

          <button disabled={loading} className="w-full bg-cintelYellow text-[#303030] font-black p-4 rounded-xl hover:scale-[1.02] transition-all uppercase tracking-widest mt-2">
            {loading ? 'Acessando...' : 'Entrar'}
          </button>
          
          <button type="button" onClick={() => router.push('/register')} className="text-cintelYellow text-[10px] uppercase font-bold tracking-widest hover:underline text-center">
            Não tem conta? Cadastre-se aqui
          </button>
        </div>
      </form>
    </div>
  )
}