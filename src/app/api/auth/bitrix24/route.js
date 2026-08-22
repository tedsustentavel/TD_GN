import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.BITRIX24_CLIENT_ID;
  const redirectUri = process.env.BITRIX24_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  const portalDomain = process.env.BITRIX24_PORTAL_DOMAIN || 'oauth.bitrix.info';

  if (!clientId) {
    return NextResponse.json({ error: 'BITRIX24_CLIENT_ID não configurado no servidor.' }, { status: 500 });
  }

  const authorizeUrl = `https://${portalDomain}/oauth/authorize/?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(authorizeUrl);
}
