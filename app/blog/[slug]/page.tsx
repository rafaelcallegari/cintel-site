'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Trash2 } from 'lucide-react' // Importando ícone de lixeira

export default function BlogPostPage() {
  const { slug } = useParams() 
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchDados = async () => {
      // 1. Busca o Post
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single() 

      setPost(data)

      // 2. Verifica se o usuário logado é Admin
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile?.role === 'admin') setIsAdmin(true)
      }

      setLoading(false)
    }
    fetchDados()
  }, [slug, supabase])

  // FUNÇÃO PARA EXCLUIR DO BANCO DE DADOS
  const handleDelete = async () => {
    if (!confirm("⚠️ ATENÇÃO: Deseja excluir permanentemente esta análise do banco de dados? Esta ação não tem volta.")) return

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', post.id)

    if (error) {
      alert("Erro ao excluir: " + error.message)
    } else {
      // Se der certo, volta para a listagem do blog
      router.push('/blog')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cintelYellow"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
        <h1 className="text-4xl font-black text-[#303030] mb-4">Post não encontrado</h1>
        <Link href="/blog" className="text-cintelYellow font-bold uppercase tracking-widest hover:underline">
          Voltar para o Blog
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 font-alegreya">
      <article className="max-w-3xl mx-auto px-6">
        
        {/* Navegação e Botão de Excluir */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cintelYellow transition-colors uppercase tracking-widest">
            ← Voltar para Insights
          </Link>

          {isAdmin && (
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all border border-red-100 text-xs uppercase tracking-widest"
            >
              <Trash2 size={16} />
              Excluir Post
            </button>
          )}
        </div>

        {/* Cabeçalho do Artigo */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-cintelYellow text-[#303030] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {post.categoria}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#303030] mb-6 leading-tight">
            {post.titulo}
          </h1>
          <p className="text-2xl text-gray-500 leading-relaxed italic">
            {post.resumo}
          </p>
        </header>

        {/* Linha Divisória */}
        <div className="h-px w-full bg-gray-100 mb-12"></div>

        {/* Corpo Renderizado em Markdown */}
        <div className="prose prose-lg prose-yellow max-w-none text-gray-700 leading-loose prose-headings:font-alegreya prose-headings:text-[#303030] prose-a:text-cintelYellow hover:prose-a:text-yellow-600 prose-img:rounded-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.conteudo}
          </ReactMarkdown>
        </div>

      </article>
    </main>
  )
}