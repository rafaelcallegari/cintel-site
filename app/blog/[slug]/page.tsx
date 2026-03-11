'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogPostPage() {
  const { slug } = useParams() 
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single() 

      setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [slug, supabase])

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
        
        {/* Navegação */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cintelYellow transition-colors uppercase tracking-widest mb-12">
          ← Voltar para Insights
        </Link>

        {/* Cabeçalho do Artigo */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-cintelYellow text-[#303030] px-4 py-1 rounded-full text-xs font-bold uppercase">
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