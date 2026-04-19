'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.')
      return
    }

    setLoading(true)

    // 1. Cria a conta no Auth do Supabase
    // Os dados em 'data' serão capturados pela sua TRIGGER no banco de dados
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone
        }
      }
    })
    
    if (error) {
      alert("Erro no cadastro: " + error.message)
      setLoading(false)
      return
    }

    // Com a Trigger configurada, o registro em 'profiles' acontece automaticamente aqui
    alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
    router.push('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-alegreya">
      <form onSubmit={handleRegister} className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-black text-[#303030] mb-2 uppercase tracking-tighter italic text-center">Cadastro Cintel</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] text-center mb-8">Inteligência de Mercado</p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              placeholder="Nome"
              className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <input
              placeholder="Sobrenome"
              className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="tel"
            placeholder="WhatsApp / Telefone"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
            onChange={e => setPhone(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="E-mail profissional"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <input
            type="password"
            placeholder="Confirme a senha"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-[#303030] outline-none focus:ring-2 focus:ring-cintelYellow transition-all"
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            disabled={loading}
            className="w-full bg-cintelYellow text-[#303030] font-black p-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest mt-4 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Criar minha conta'}
          </button>

          <p className="text-center text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-4">
            Já possui uma conta? <a href="/login" className="text-cintelYellow hover:underline transition-colors">Entre aqui</a>
          </p>
        </div>
      </form>
    </div>
  )
}