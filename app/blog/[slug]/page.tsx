import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

interface Props { params: { slug: string } }

export default function PostPage({ params }: Props){
  const { slug } = params
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return <div className="p-8">Post não encontrado.</div>
  }
  const file = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(file)
  const html = marked.parse(content)

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-sm text-gray-600 mb-6">{data.date}</p>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
