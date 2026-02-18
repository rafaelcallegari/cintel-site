'use client'

import { useState } from 'react'

interface Post {
  id: number;
  titulo: string;
  resumo: string;
  data: string;
  categoria: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      titulo: "O fim do amadorismo no Real Estate",
      resumo: "Como a ciência de dados está subvertendo as decisões intuitivas no varejo brasileiro.",
      data: "06 Fev 2026",
      categoria: "Tecnologia"
    }
  ]);

  // Estados para o formulário de Admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [newPost, setNewPost] = useState({ titulo: '', resumo: '', categoria: 'Inteligência' });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: Date.now(),
      titulo: newPost.titulo,
      resumo: newPost.resumo,
      data: new Date().toLocaleDateString('pt-BR'),
      categoria: newPost.categoria
    };
    setPosts([post, ...posts]);
    setNewPost({ titulo: '', resumo: '', categoria: 'Inteligência' });
    setShowAdmin(false);
  };

  return (
    <section className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header do Blog */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-[#303030] font-alegreya mb-4">Insights Cintel</h1>
            <p className="text-gray-500 text-xl font-alegreya">Ciência, dados e a transformação do espaço urbano.</p>
          </div>
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-[10px] font-bold text-gray-300 hover:text-cintelYellow transition-colors uppercase tracking-widest"
          >
            Acesso Restrito
          </button>
        </div>

        {/* TELA DE ADMIN (Oculta por padrão) */}
        {showAdmin && (
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
                placeholder="Resumo ou conteúdo curto..."
                className="w-full p-4 rounded-xl border border-gray-200 min-h-[150px] outline-none focus:ring-2 focus:ring-cintelYellow"
                value={newPost.resumo}
                onChange={e => setNewPost({...newPost, resumo: e.target.value})}
                required
              />
              <div className="flex justify-between items-center">
                <select 
                   className="p-3 rounded-lg border border-gray-200 text-sm font-bold"
                   value={newPost.categoria}
                   onChange={e => setNewPost({...newPost, categoria: e.target.value})}
                >
                  <option>Inteligência</option>
                  <option>Tecnologia</option>
                  <option>Expansão</option>
                </select>
                <button type="submit" className="bg-[#303030] text-white px-10 py-3 rounded-full font-bold hover:bg-black transition-all">
                  Publicar Agora
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA DE POSTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="mb-6 overflow-hidden rounded-[2rem] bg-gray-100 aspect-video relative">
                {/* Aqui futuramente você pode colocar uma imagem de capa */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-tighter text-4xl opacity-20">
                  Cintel DataViz
                </div>
                <div className="absolute top-6 left-6 bg-cintelYellow text-[#303030] px-4 py-1 rounded-full text-xs font-bold uppercase">
                  {post.categoria}
                </div>
              </div>
              
              <span className="text-sm font-bold text-gray-400">{post.data}</span>
              <h2 className="text-3xl font-bold text-[#303030] mt-2 mb-4 group-hover:text-cintelYellow transition-colors font-alegreya">
                {post.titulo}
              </h2>
              <p className="text-gray-600 leading-relaxed font-alegreya text-lg">
                {post.resumo}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-[#303030] font-bold group-hover:gap-4 transition-all">
                <span>Ler análise completa</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}