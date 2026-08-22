import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Colaborador from '@/models/Colaborador';
import { signSession } from '@/lib/session';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Código de autorização não fornecido pelo Bitrix24.' }, { status: 400 });
  }

  const clientId = process.env.BITRIX24_CLIENT_ID;
  const clientSecret = process.env.BITRIX24_CLIENT_SECRET;
  const redirectUri = process.env.BITRIX24_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  const portalDomain = process.env.BITRIX24_PORTAL_DOMAIN || 'oauth.bitrix.info';

  try {
    const tokenUrl = `https://${portalDomain}/oauth/token/?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }

    const { access_token, client_endpoint } = tokenData;

    if (!access_token || !client_endpoint) {
      return NextResponse.json({ error: 'Resposta de autenticação inválida do Bitrix24.' }, { status: 400 });
    }

    const userRes = await fetch(`${client_endpoint}user.current.json?auth=${access_token}`);
    const userData = await userRes.json();

    if (userData.error) {
      return NextResponse.json({ error: userData.error_description || userData.error }, { status: 400 });
    }

    const bitrixUser = userData.result;
    if (!bitrixUser || !bitrixUser.ID) {
      return NextResponse.json({ error: 'Não foi possível recuperar os dados do colaborador.' }, { status: 400 });
    }

    const bitrixId = String(bitrixUser.ID);
    const email = bitrixUser.EMAIL ? bitrixUser.EMAIL.toLowerCase().trim() : '';
    const nomeCompleto = `${bitrixUser.NAME || ''} ${bitrixUser.LAST_NAME || ''}`.trim() || 'Colaborador Bitrix24';

    const adminEmails = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());
    const adminBitrixIds = (process.env.ADMIN_BITRIX_IDS || '').split(',').map(id => id.trim());

    let shouldBeAdmin = adminEmails.includes(email) || adminBitrixIds.includes(bitrixId);

    await dbConnect();

    let colaborador = await Colaborador.findOne({ bitrix_id: bitrixId });

    if (!colaborador && email) {
      colaborador = await Colaborador.findOne({ email });
    }

    if (colaborador) {
      colaborador.bitrix_id = bitrixId;
      if (email) colaborador.email = email;
      if (shouldBeAdmin) {
        colaborador.isAdmin = true;
      }
      await colaborador.save();
    } else {
      colaborador = await Colaborador.create({
        nome: nomeCompleto,
        email: email || undefined,
        bitrix_id: bitrixId,
        isAdmin: shouldBeAdmin,
      });
    }

    const sessionPayload = {
      id: colaborador._id.toString(),
      nome: colaborador.nome,
      email: colaborador.email || '',
      bitrix_id: colaborador.bitrix_id || '',
      isAdmin: colaborador.isAdmin === true,
    };

    const sessionToken = await signSession(sessionPayload);

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('colaborador_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Error during Bitrix24 auth callback:', err);
    return NextResponse.json({ error: 'Erro interno durante o processamento da autenticação: ' + err.message }, { status: 500 });
  }
}
