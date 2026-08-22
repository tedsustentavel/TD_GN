const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-at-least-32-chars-long-for-security';

async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const stringifiedHeader = JSON.stringify(header);
  const stringifiedPayload = JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
  });

  const base64UrlHeader = btoa(stringifiedHeader).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const base64UrlPayload = btoa(unescape(encodeURIComponent(stringifiedPayload))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const dataToSign = `${base64UrlHeader}.${base64UrlPayload}`;
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  
  const base64UrlSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${base64UrlSignature}`;
}

export async function verifySession(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const dataToVerify = `${header}.${payload}`;

  try {
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    
    // Decode signature
    const binarySig = atob(signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(dataToVerify));
    if (!isValid) return null;

    // Decode payload
    const decodedPayload = JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return decodedPayload;
  } catch (err) {
    return null;
  }
}
