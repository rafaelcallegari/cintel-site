import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { sessionId } = await request.json()

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID obrigatório' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.orderId
      if (orderId) {
        await supabase
          .from('orders')
          .update({ status: 'Em andamento', payment_status: 'pago' })
          .eq('id', orderId)
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, payment_status: session.payment_status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
