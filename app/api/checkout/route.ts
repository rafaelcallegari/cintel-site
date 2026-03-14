import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestruturamos TODOS os possíveis campos (tanto do serviço novo quanto do antigo)
    const { 
      // Campos enviados pelo Mapa de Calor
      produto, preco, orderId, successUrl, cancelUrl,
      // Campos enviados pela Análise Técnica (Serviço antigo)
      email, municipio, vocacao, areaConstruida, areaTerreno, descricao 
    } = body;

    // Lógica para descobrir qual serviço está sendo comprado
    const isMapaDeCalor = produto !== undefined && preco !== undefined;

    // Define os valores dinamicamente com base no serviço
    const finalName = isMapaDeCalor ? produto : `Cintel: ${vocacao || 'Análise'}`;
    const finalDescription = isMapaDeCalor ? 'Serviço de Mapa de Calor' : `Análise técnica para: ${municipio || 'Não informado'}`;
    const finalPrice = isMapaDeCalor ? preco : 249000; // Se não for mapa, cobra R$ 2.490,00
    
    const finalSuccessUrl = isMapaDeCalor ? successUrl : `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-sucesso?email=${email}`;
    const finalCancelUrl = isMapaDeCalor ? cancelUrl : `${process.env.NEXT_PUBLIC_BASE_URL}/market/analise-imovel`;

    const finalMetadata = isMapaDeCalor 
      ? { orderId: orderId } 
      : {
          endereco: String(municipio),
          area_construida: String(areaConstruida),
          area_terreno: String(areaTerreno),
          descricao_imovel: String(descricao)
        };

    // Cria a sessão no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined, // Se não tiver email no primeiro passo, o Stripe pede na tela dele
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