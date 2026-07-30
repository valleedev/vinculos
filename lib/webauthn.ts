'use client';

const CRED_KEY = 'vinculos-webauthn-cred-id';

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const base64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function b64urlEncode(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function webauthnSoportado(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

export function hayCredencialGuardada(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(CRED_KEY);
}

/**
 * Gate local: no hay servidor que valide el reto ni el attestation, sólo se
 * usa la biometría de la plataforma (Face ID / Touch ID) como cerrojo del
 * teléfono. Nunca debe impedir el acceso a datos ya guardados: quien llama
 * decide qué hacer si esto falla (dejar entrar igual).
 */
export async function registrarCredencial(): Promise<boolean> {
  if (!webauthnSoportado()) return false;
  try {
    const userId = crypto.getRandomValues(new Uint8Array(16));
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const cred = (await navigator.credentials.create({
      publicKey: {
        rp: { name: 'Vínculos' },
        user: { id: userId, name: 'dueño-del-iphone', displayName: 'Vínculos' },
        challenge,
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;
    if (!cred) return false;
    localStorage.setItem(CRED_KEY, b64urlEncode(cred.rawId));
    return true;
  } catch {
    return false;
  }
}

export async function verificarCredencial(): Promise<boolean> {
  if (!webauthnSoportado()) return false;
  const id = localStorage.getItem(CRED_KEY);
  if (!id) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ id: b64urlDecode(id) as BufferSource, type: 'public-key' }],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return !!assertion;
  } catch {
    return false;
  }
}
