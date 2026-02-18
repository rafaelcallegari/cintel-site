import '../styles/globals.css'
import Header from '../components/Header'

export const metadata = {
  title: 'Cintel Inteligência',
  description: 'Soluções de inteligência de mercado e site location',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="font-sans">
        <Header />
        {children}
      </body>
    </html>
  )
}
