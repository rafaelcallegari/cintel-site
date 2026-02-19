import Hero from '../components/Hero'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'
import About from '../components/About'
import RevealOnScroll from '../components/RevealOnScroll'
import Services from '../components/Services'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />

      <RevealOnScroll>
        <About />
      </RevealOnScroll>

      <RevealOnScroll>
        <Services />
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-bold mb-4">Entre em contato!</h2>
            <p className="mb-4"></p>
            <ContactForm />
          </div>
        </section>
      </RevealOnScroll>

      <Footer />
    </main>
  )
}

export const metadata = {
  title: 'Cintel | Inteligência e Dados para o Mercado Imobiliário Comercial',
  description: 'Fundada por ex-executivo do GPA, a Cintel une ciência de dados e tecnologia para transformar a expansão imobiliária e o varejo no Brasil.',
  openGraph: {
    title: 'Cintel | O fim do amadorismo no Real Estate',
    description: 'Tecnologia proprietária para identificar a vocação real de qualquer endereço comercial.',
    images: ['/icons/Logo.png'],
  },
}