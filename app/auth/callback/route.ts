import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // Cria uma resposta para manipular cookies
    const response = NextResponse.redirect(`${origin}/`)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              response.cookies.set(name, value, options)
            } catch (error) {
              // O Middleware lidará com a persistência se o Route Handler falhar
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              response.cookies.set(name, '', options)
            } catch (error) {
              // O Middleware lidará com a remoção
            }
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return response
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}