'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// O editor precisa ser carregado dinamicamente no Next.js
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Post {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  created_at: string;
}

export default function BlogPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [posts, setPosts] = useState<Post[]>([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newPost, setNewPost] = useState({ 
    titulo: '', 
    resumo: '', 
    conteudo: '', 
    categoria: 'Inteligência' 
  })

  // Busca os posts e verifica se o usuário logado é Admin
  useEffect(() => {
    const fetchDados = async () => {
      // 1. Puxa os posts do banco
      const { data: postsDB } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (postsDB) setPosts(postsDB)

      // 2. Verifica se o usuário é admin
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          
        if (profile?.role === 'admin') setIsAdmin(true)
      }
    }
    fetchDados()
  }, [supabase])

  // Transforma "Meu Título" em "meu-titulo"
  const generateSlug = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const slugGerado = generateSlug(newPost.titulo)

    // Salva o post no Supabase
    const { data, error } = await supabase.from('blog_posts').insert([{
      titulo: newPost.titulo,
      slug: slugGerado,
      resumo: newPost.resumo,
      conteudo: newPost.conteudo,
      categoria: newPost.categoria
    }]).select()

    if (error) {
      alert("Erro ao publicar: " + error.message)
    } else if (data) {
      setPosts([data[0], ...posts])
      setNewPost({ titulo: '', resumo: '', conteudo: '', categoria: 'Inteligência' })
      setShowAdmin(false)
    }
    setLoading(false)
  }

  return (
    <section className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-[#303030] font-alegreya mb-4">Insights Cintel</h1>
            <p className="text-gray-500 text-xl font-alegreya">Ciência, dados e a transformação do espaço urbano.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowAdmin(!showAdmin)} className="text-[10px] font-bold text-gray-300 hover:text-cintelYellow transition-colors uppercase tracking-widest">
              Acesso Restrito
            </button>
          )}
        </div>

        {/* Painel do Administrador (Oculto para visitantes) */}
        {showAdmin && isAdmin && (
          <div className="mb-20 bg-gray-50 p-10 rounded-[2.5rem] border-2 border-dashed border-cintelYellow animate-in fade-in slide-in-from-top-4">
            <h2 className="text-2xl font-bold mb-6 text-[#303030]">Nova Publicação</h2>
            <form onSubmit={handlePublish} className="space-y-4">
              <input 
                placeholder="Título da Postagem" 
                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cintelYellow" 
                value={newPost.titulo} 
                onChange={e => setNewPost({...newPost, titulo: e.target.value})} 
                required 
              />
              
              <textarea 
                placeholder="Resumo para a vitrine (curto)..." 
                className="w-full p-4 rounded-xl border border-gray-200 min-h-[100px] outline-none focus:ring-2 focus:ring-cintelYellow resize-none" 
                value={newPost.resumo} 
                onChange={e => setNewPost({...newPost, resumo: e.target.value})} 
                required 
              />
              
              {/* Editor Markdown */}
              <div data-color-mode="light" className="w-full rounded-xl overflow-hidden border border-gray-200">
                <MDEditor
                  value={newPost.conteudo}
                  onChange={(val) => setNewPost({...newPost, conteudo: val || ''})}
                  height={400}
                  preview="edit"
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <select 
                  className="p-3 rounded-lg border border-gray-200 text-sm font-bold outline-none" 
                  value={newPost.categoria} 
                  onChange={e => setNewPost({...newPost, categoria: e.target.value})}
                >
                  <option>Inteligência</option>
                  <option>Tecnologia</option>
                  <option>Expansão</option>
                </select>
                <button disabled={loading} type="submit" className="bg-[#303030] text-white px-10 py-3 rounded-full font-bold hover:bg-black transition-all">
                  {loading ? 'Salvando...' : 'Publicar Agora'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vitrine de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer block">
              <article>
                <div className="mb-6 overflow-hidden rounded-[2rem] bg-gray-100 aspect-video relative transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-tighter text-4xl opacity-20">
                    Cintel DataViz
                  </div>
                  <div className="absolute top-6 left-6 bg-cintelYellow text-[#303030] px-4 py-1 rounded-full text-xs font-bold uppercase z-10">
                    {post.categoria}
                  </div>
                </div>
                
                <span className="text-sm font-bold text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </span>
                <h2 className="text-3xl font-bold text-[#303030] mt-2 mb-4 group-hover:text-cintelYellow transition-colors font-alegreya leading-tight">
                  {post.titulo}
                </h2>
                <p className="text-gray-600 leading-relaxed font-alegreya text-lg line-clamp-2">
                  {post.resumo}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-[#303030] font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-widest">
                  <span>Ler análise completa</span>
                  <svg className="w-5 h-5 text-cintelYellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}