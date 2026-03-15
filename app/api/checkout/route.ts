import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      produto, preco, orderId, successUrl, cancelUrl,
      email, municipio, vocacao, areaConstruida, areaTerreno, descricao 
    } = body;

    const isMapaDeCalor = produto !== undefined && preco !== undefined;

    const finalName = isMapaDeCalor ? produto : `Cintel: ${vocacao || 'Análise'}`;
    const finalDescription = isMapaDeCalor ? 'Serviço de Mapa de Calor' : `Análise técnica para: ${municipio || 'Não informado'}`;
    const finalPrice = isMapaDeCalor ? preco : 249000;
    
    const finalSuccessUrl = isMapaDeCalor 
      ? successUrl 
      : `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-success?email=${email}`;
    const finalCancelUrl = isMapaDeCalor ? cancelUrl : `${process.env.NEXT_PUBLIC_BASE_URL}/market/analise-imovel`;

    const finalMetadata = isMapaDeCalor 
      ? { orderId: String(orderId) } 
      : {
          orderId: String(orderId),
          endereco: String(municipio),
          area_construida: String(areaConstruida),
          area_terreno: String(areaTerreno),
          descricao_imovel: String(descricao)
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: finalName,
              description: finalDescription,
            },
            unit_amount: finalPrice, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: finalMetadata,
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Erro no Stripe:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}