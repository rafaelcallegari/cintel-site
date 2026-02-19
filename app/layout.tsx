import '../styles/globals.css'
import Header from '../components/Header'

// 1. Metadata posicionado após os imports (Ideal para Server Components)
export const metadata = {
  title: 'Cintel Inteligência',
  description: 'Soluções de inteligência de mercado e site location',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        {/* 2. CORREÇÃO: crossOrigin="" (vazio) resolve o erro de tipagem 'true' não atribuível */}
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="" 
        />
        
        {/* Importação da fonte Alegreya */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="font-sans">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}