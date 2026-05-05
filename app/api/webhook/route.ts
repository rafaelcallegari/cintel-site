import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Fluxo antigo — checkout session com orderId
    const orderId = session.metadata?.orderId
    if (orderId) {
      await supabase
        .from('orders')
        .update({ status: 'Em andamento', payment_status: 'pago' })
        .eq('id', orderId)
    }

    // Fluxo novo — payment link com pedidoId
    const pedidoId = session.metadata?.pedidoId
    if (pedidoId) {
      await supabase
        .from('orders')
        .update({
          status: 'Concluído',
          payment_status: 'pago',
          acesso_liberado: true,
          stripe_payment_id: session.payment_intent as string,
        })
        .eq('id', pedidoId)
    }
  }

  return NextResponse.json({ received: true })
}