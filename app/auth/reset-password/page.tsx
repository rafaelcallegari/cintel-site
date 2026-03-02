'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // O Supabase identifica o usuário automaticamente pelo código na URL
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      alert("Erro ao atualizar: " + error.message)
    } else {
      alert("Senha atualizada com sucesso! Use a nova senha para entrar.")
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <form onSubmit={handleUpdatePassword} className="bg-[#303030] w-full max-w-md p-10 rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Nova Senha</h1>
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Crie uma senha forte para sua conta Cintel</p>
        
        <div className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="Digite a nova senha" 
            className="w-full p-4 bg-[#404040] rounded-xl text-white outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
            onChange={e => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
          <button 
            disabled={loading}
            className="w-full bg-cintelYellow text-[#303030] font-black p-4 rounded-xl hover:scale-[1.02] transition-all uppercase tracking-widest mt-2"
          >
            {loading ? 'Salvando...' : 'Confirmar Nova Senha'}
          </button>
        </div>
      </form>
    </div>
  )
}