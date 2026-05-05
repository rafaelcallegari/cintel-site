import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { pedidoId, preco } = await request.json()

    if (!pedidoId || !preco) {
      return NextResponse.json({ error: 'pedidoId e preco são obrigatórios' }, { status: 400 })
    }

    const { data: pedido, error: pedidoError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', pedidoId)
      .single()

    if (pedidoError || !pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    // Cria o price separado (paymentLinks não aceita price_data inline)
    const price = await stripe.prices.create({
      currency: 'brl',
      unit_amount: Math.round(preco * 100),
      product_data: {
        name: pedido.servico_solicitado || 'Serviço Cintel',
      },
    })

    // Cria o Payment Link com o price criado acima
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { pedidoId },
      after_completion: {
        type: 'redirect',
        redirect: { url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-success` },
      },
    })

    // Atualiza o pedido no Supabase
    await supabase
      .from('orders')
      .update({
        preco,
        payment_link: paymentLink.url,
        status: 'aguardando_pagamento',
      })
      .eq('id', pedidoId)

    // Envia email pro cliente
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: pedido.cliente_email,
        subject: 'Seu link de pagamento está pronto — Cintel',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Olá! Sua solicitação foi analisada.</h2>
            <p>O valor do seu serviço <strong>${pedido.servico_solicitado}</strong> para 
            <strong>${pedido.municipio}/${pedido.uf}</strong> foi definido em 
            <strong>R$ ${Number(preco).toFixed(2).replace('.', ',')}</strong>.</p>
            <p>Clique no botão abaixo para realizar o pagamento:</p>
            <a href="${paymentLink.url}" 
               style="display: inline-block; background: #303030; color: white; 
                      padding: 14px 28px; border-radius: 8px; text-decoration: none; 
                      font-weight: bold; margin: 16px 0;">
              Pagar agora
            </a>
            <p style="color: #666; font-size: 14px;">
              Após o pagamento, seu acesso será liberado automaticamente.
            </p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ url: paymentLink.url })
  } catch (err: any) {
    console.error('Erro ao gerar link:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}