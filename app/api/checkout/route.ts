import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    const { email, municipio, vocacao, areaConstruida, areaTerreno, descricao } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Cintel: ${vocacao}`,
              description: `Análise técnica para: ${municipio}`,
            },
            unit_amount: 249000, // R$ 2.490,00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Metadados para o Fernando visualizar os detalhes técnicos no painel do Stripe
      metadata: {
        endereco: municipio,
        area_construida: areaConstruida,
        area_terreno: areaTerreno,
        descricao_imovel: descricao
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/market/success?email=${email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/market/analise-imovel`,
    });

    // IMPORTANTE: Retornar a session.url para o frontend redirecionar
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Erro no Stripe:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}