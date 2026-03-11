'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function AdminPedidos() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [pedidos, setPedidos] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    fetchPedidos()
  }, [supabase])

  const fetchPedidos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    
    if (profile?.role === 'admin') {
      setIsAdmin(true)
      const { data: orders } = await supabase
        .from('orders')
        .select(`*, profiles:user_id (full_name, email)`)
        .order('created_at', { ascending: false })

      if (orders) setPedidos(orders)
    }
    setLoading(false)
  }

  // DISPARA E-MAIL DE NOTIFICAÇÃO
  const dispararEmail = async (pedido: any) => {
    if (!pedido.profiles?.email) return
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pedido.profiles.email,
          clienteNome: pedido.profiles.full_name,
          servico: pedido.tipo_produto || 'Análise de Vocação'
        }),
      })
    } catch (err) {
      console.error("Falha ao enviar e-mail:", err)
    }
  }

  // ATUALIZA STATUS MANUALMENTE
  const atualizarStatus = async (id: string, novoStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: novoStatus }).eq('id', id)
    if (!error) {
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p))
      if (novoStatus === 'Concluído') {
        const pedidoData = pedidos.find(p => p.id === id)
        dispararEmail(pedidoData)
      }
    }
  }

  // FAZ UPLOAD DO PDF E CONCLUI O PEDIDO
  const handleUploadPDF = async (e: any, pedidoId: string) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploading(pedidoId)
    const fileName = `${pedidoId}_${Date.now()}.pdf`

    try {
      // 1. Sobe para o bucket 'analises' (Crie este bucket no Storage do Supabase como Público)
      const { error: uploadError } = await supabase.storage.from('analises').upload(fileName, file)
      if (uploadError) throw uploadError

      // 2. Pega URL Pública
      const { data: { publicUrl } } = supabase.storage.from('analises').getPublicUrl(fileName)

      // 3. Atualiza banco e dispara e-mail
      const { error: dbError } = await supabase.from('orders')
        .update({ file_name: publicUrl, status: 'Concluído' })
        .eq('id', pedidoId)
      
      if (dbError) throw dbError

      const pedidoData = pedidos.find(p => p.id === pedidoId)
      dispararEmail(pedidoData)

      alert('Relatório enviado e e-mail disparado!')
      fetchPedidos()
    } catch (err: any) {
      alert('Erro no upload: ' + err.message)
    } finally {
      setUploading(null)
    }
  }

  if (loading) return <div className="min-h-screen pt-40 text-center font-bold font-alegreya uppercase text-gray-400">Carregando painel...</div>
  if (!isAdmin) return <div className="min-h-screen pt-40 text-center font-bold text-red-500">Acesso Negado.</div>

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20 font-alegreya">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#303030]">Gestão de Pedidos</h1>
            <p className="text-gray-500 mt-2">Controle de entregas e status dos serviços Cintel.</p>
          </div>
          <Link href="/blog" className="text-sm font-bold border-b-2 border-cintelYellow hover:text-cintelYellow transition-colors uppercase">Ir para o Blog</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest">
                <th className="p-4 border-b border-gray-200">Cliente</th>
                <th className="p-4 border-b border-gray-200">Tipo de Pedido</th>
                <th className="p-4 border-b border-gray-200 text-center">Status</th>
                <th className="p-4 border-b border-gray-200 text-center">Acesso / Entrega</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-bold text-[#303030]">{pedido.profiles?.full_name}</div>
                    <div className="text-xs text-gray-400">{pedido.profiles?.email}</div>
                  </td>

                  <td className="p-4 border-b border-gray-100 font-bold">{pedido.tipo_produto}</td>

                  <td className="p-4 border-b border-gray-100 text-center">
                    <select 
                      className={`p-2 rounded-lg text-[10px] font-bold border outline-none cursor-pointer w-full text-center
                        ${pedido.status === 'Concluído' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}
                      `}
                      value={pedido.status}
                      onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                    >
                      <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </td>

                  <td className="p-4 border-b border-gray-100 text-center">
                    {pedido.tipo_produto === 'Mapa de Calor' ? (
                      <div className="flex flex-col items-center gap-1">
                        {pedido.file_name ? (
                          <Link 
                            href={`/admin/view-map?file=${pedido.file_name}`} 
                            className="bg-[#303030] text-cintelYellow px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black"
                          >
                            🗺️ Ver Mapa
                          </Link>
                        ) : <span className="text-gray-400 italic text-xs">Sem arquivo</span>}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {pedido.file_name?.includes('http') ? (
                          <a href={pedido.file_name} target="_blank" className="text-green-600 font-bold text-[10px] uppercase underline italic">
                            ✓ Relatório PDF Enviado
                          </a>
                        ) : (
                          <label className="cursor-pointer bg-cintelYellow text-[#303030] px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all">
                            {uploading === pedido.id ? 'Subindo...' : '📎 Anexar Relatório'}
                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUploadPDF(e, pedido.id)} disabled={uploading === pedido.id} />
                          </label>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}