import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
  
  // Verificação de roles para usuários autenticados
  if (user) {
    // Rotas públicas que não precisam de verificação de roles
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/auth')
    ) {
      return supabaseResponse
    }
    
    try {
      // Buscar o perfil do usuário com suas roles
      const { data: profile } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single()
      
      if (profile?.roles) {
        const roles = profile.roles
        
        // Verificar se o usuário tem apenas a role 'usuario'
        const isOnlyUser = roles.length === 1 && roles.includes('usuario')
        
        // Verificar se o usuário tem role adicional (tesoureiro ou secretario)
        const hasAdditionalRole = roles.includes('tesoureiro') || roles.includes('secretario')
        
        // Verificar se o usuário está na página inicial
        if (request.nextUrl.pathname === '/') {
          // Redirecionar com base nas roles
          const url = request.nextUrl.clone()
          url.pathname = hasAdditionalRole ? '/painel' : '/protected'
          return NextResponse.redirect(url)
        }
        
        // Redirecionar com base nas roles e na URL atual
        if (isOnlyUser && request.nextUrl.pathname.startsWith('/painel')) {
          // Usuário simples tentando acessar o painel
          const url = request.nextUrl.clone()
          url.pathname = '/protected'
          return NextResponse.redirect(url)
        } else if (hasAdditionalRole && request.nextUrl.pathname === '/protected') {
          // Usuário com roles adicionais tentando acessar área de usuário comum
          const url = request.nextUrl.clone()
          url.pathname = '/painel'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      // Em caso de erro, apenas continua sem fazer redirecionamento específico
      console.error('Erro ao verificar roles do usuário:', error)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
