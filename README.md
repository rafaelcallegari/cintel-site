# Cintel Site (scaffold)

Projeto Next.js + TypeScript + Tailwind (scaffold) para o site da Cintel.

Rodando localmente:

1. Instale dependências:

   npm install

2. Rode em modo dev:

   npm run dev

3. Abra http://localhost:3000

Notas:
- Blog baseado em arquivos Markdown em `content/posts`.
- Formulário de contato usa Formspree. Para configurar sem editar o código, crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/<SEU_ID_AQUI>
```

Substitua `<SEU_ID_AQUI>` pelo ID do form que você cria em https://formspree.io. Depois reinicie o servidor (`npm run dev`). Se preferir, você pode deixar o campo `NEXT_PUBLIC_FORMSPREE_ENDPOINT` vazio e editar `components/ContactForm.tsx` diretamente (há um placeholder `https://formspree.io/f/YOUR_FORMSPREE_ID`).
- Ainda não fazer deploy — podemos adicionar Vercel quando estiver pronto.
