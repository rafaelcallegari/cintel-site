import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, clienteNome, servico } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Cintel <onboarding@resend.dev>', // Depois você pode configurar seu domínio próprio
      to: [email],
      subject: `Sua ${servico} está pronta!`,
      html: `
        <div style="font-family: sans-serif; color: #303030;">
          <h1 style="color: #303030;">Olá, ${clienteNome}!</h1>
          <p>Temos ótimas notícias: nossa equipe técnica finalizou sua <strong>${servico}</strong>.</p>
          <p>Você já pode acessar todos os dados e insights detalhados diretamente no seu painel.</p>
          <br />
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
             style="background-color: #ffcc00; color: #303030; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 10px;">
            ACESSAR MEU PAINEL
          </a>
          <br /><br />
          <p>Atenciosamente,<br />Equipe Cintel</p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}