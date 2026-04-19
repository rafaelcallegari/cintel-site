# cintel-site — Contexto do Projeto

## Stack
- Next.js App Router (`app/`)
- Supabase (auth + banco)
- Stripe (pagamentos)
- Resend (emails)
- Vercel (deploy)
- TypeScript + Tailwind CSS

## Estrutura de Páginas
```
app/
  page.tsx                  → Landing page principal
  layout.tsx                → Layout raiz
  login/page.tsx
  register/page.tsx
  dashboard/page.tsx
  checkout/page.tsx
  checkout-success/page.tsx
  auth/reset-password/page.tsx
  market/page.tsx
  market/[servico]/page.tsx → Rota dinâmica de serviço
  market/analise-imovel/page.tsx
  admin/pedidos/page.tsx
  admin/view-map/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  sobre/page.tsx
```

## Componentes principais
```
components/
  Hero.tsx         → Seção hero da landing (imagem de fundo, CTAs)
  About.tsx        → Seção "Quem Somos"
  Services.tsx     → Cards de serviços
  Header.tsx       → Navegação
  Footer.tsx
  ContactForm.tsx
  RevealOnScroll.tsx
```

## Regras obrigatórias
- NUNCA alterar arquivos em `node_modules/`
- NUNCA alterar lógica de autenticação Supabase sem instrução explícita
- NUNCA alterar `app/api/webhook/route.ts` sem instrução explícita
- Sempre usar Tailwind para estilos — sem CSS inline salvo exceções justificadas
- Variáveis de ambiente ficam no `.env.local` (nunca hardcodar)

## Variáveis de ambiente necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_BASE_URL`
