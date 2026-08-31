import { NextResponse } from 'next/server';
import { verifySession } from './lib/session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Defina caminhos públicos (não protegidos)
  const isLoginPage = pathname === '/login';
  const isAuthApi = pathname.startsWith('/api/auth');
  const isStaticFile = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|webp)$/);

  // Se for arquivo estático ou rota de API de autenticação, continue sem validar
  if (isStaticFile || isAuthApi) {
    return NextResponse.next();
  }

  // 2. Tente obter o cookie de sessão do colaborador
  const sessionCookie = request.cookies.get('colaborador_session');
  let sessionPayload = null;

  if (sessionCookie) {
    sessionPayload = await verifySession(sessionCookie.value);
  }

  // 3. Se o usuário NÃO estiver logado
  if (!sessionPayload) {
    // Se for uma página protegida, redirecione para login
    if (!isLoginPage) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { success: false, error: 'Não autorizado. Por favor, realize o login.' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Se já estiver na página de login, continue
    return NextResponse.next();
  }

  // 4. Se o usuário ESTIVER logado
  
  // Se tentar acessar o login, redirecione para a página inicial
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Restrição da área de administração (/admin e subpáginas)
  if (pathname.startsWith('/admin')) {
    if (!sessionPayload.isAdmin) {
      // Se não for admin, redireciona para a página inicial
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Segurança da API: Bloqueia POST/PUT/DELETE em rotas de API para não-admins
  if (pathname.startsWith('/api')) {
    const method = request.method;
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const isAprovarRoute = pathname.match(/^\/api\/termos\/[^/]+\/aprovar$/);
      if (!sessionPayload.isAdmin && !isAprovarRoute) {
        return NextResponse.json(
          { success: false, error: 'Acesso negado. Apenas administradores podem realizar modificações.' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Executa o middleware em todas as rotas exceto as de sistema interno
  matcher: ['/((?!api/auth/callback|_next/static|_next/image|favicon.ico).*)'],
};
