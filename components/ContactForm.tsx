'use client'

import { useState } from 'react'

export default function ContactForm(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORMSPREE_ID'

  function formatInternationalPhone(value: string) {
    // keep leading + if present, remove all other non-digits
    let s = value.trim()
    const hasPlus = s.startsWith('+')
    s = s.replace(/[^+\d]/g, '')
    if (hasPlus) {
      // ensure only one leading +
      s = '+' + s.replace(/\+/g, '')
      const digits = s.slice(1).slice(0, 15) // limit to 15 digits (E.164)
      if (digits.length === 0) return '+'
      if (digits.length <= 2) return `+${digits}`
      if (digits.length <= 5) return `+${digits}`
      if (digits.length <= 9) return `+${digits.slice(0, digits.length - 4)} ${digits.slice(digits.length - 4)}`
      // split last 4 digits with a dash
      return `+${digits.slice(0, digits.length - 8)} ${digits.slice(digits.length - 8, digits.length - 4)}-${digits.slice(digits.length - 4)}`
    } else {
      // no plus: fallback to local-like formatting (Brazilian-friendly)
      const d = s.replace(/\D/g, '').slice(0, 11)
      if (!d) return ''
      if (d.length <= 2) return `(${d}`
      if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
      if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
      return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const payload = { name, email, whatsapp: whatsapp.replace(/\D/g, ''), message }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setWhatsapp('')
        setMessage('')
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form className="max-w-xl" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1">Nome</label>
        <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">E-mail</label>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">WhatsApp</label>
        <input
          name="whatsapp"
          inputMode="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatInternationalPhone(e.target.value))}
          placeholder="+55 (11) 91234-5678"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Mensagem</label>
        <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} required />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === 'loading'} className="btn-primary hover:brightness-90 transition duration-300 disabled:opacity-60">{status === 'loading' ? 'Enviando...' : 'Enviar'}</button>
        {status === 'success' && <p className="text-green-600" role="status" aria-live="polite">Mensagem enviada — obrigado!</p>}
        {status === 'error' && <p className="text-red-600" role="status" aria-live="polite">Ocorreu um erro, tente novamente.</p>}
      </div>
    </form>
  )
}
