import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, municipio, vocacao, link } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Cintel <onboarding@resend.dev>', // No início, use este e-mail padrão do Resend
      to: [email],
      subject: `Relatório Disponível: ${municipio} (${vocacao})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #303030;">Sua Análise Cintel está pronta!</h2>
          <p>Olá,</p>
          <p>O algoritmo da <strong>Cintel</strong> processou os dados de vocação para o segmento de <strong>${vocacao}</strong> em <strong>${municipio}</strong>.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}${link}" 
               style="background-color: #FFD700; color: #303030; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              ACESSAR MAPA INTERATIVO
            </a>
          </div>
          <p style="font-size: 12px; color: #777;">
            Este é um relatório automatizado. O link acima direciona para o seu dashboard interativo de geomarketing.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}