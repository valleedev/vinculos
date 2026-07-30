import { db } from './db';
import { AJUSTES_DEFAULT, type Ajustes, type Persona, type PersonaForm } from './types';

/**
 * Capa de datos. Hoy pega a IndexedDB (Dexie); cuando exista backend,
 * sólo hay que reescribir el cuerpo de estas funciones para llamar a la API —
 * el resto de la app no conoce el detalle de almacenamiento.
 */

export async function listarPersonas(): Promise<Persona[]> {
  return db.personas.toArray();
}

export async function obtenerAjustes(): Promise<Ajustes> {
  const a = await db.ajustes.get('default');
  if (a) return a;
  await db.ajustes.put(AJUSTES_DEFAULT);
  return AJUSTES_DEFAULT;
}

export async function guardarAjustes(parcial: Partial<Ajustes>): Promise<void> {
  const actual = await obtenerAjustes();
  await db.ajustes.put({ ...actual, ...parcial });
}

async function fotoDataUrlABlob(dataUrl: string | null): Promise<Blob | undefined> {
  if (!dataUrl) return undefined;
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function crearPersona(form: PersonaForm): Promise<Persona> {
  const id = 'p' + Date.now() + Math.random().toString(36).slice(2, 7);
  const foto = await fotoDataUrlABlob(form.fotoDataUrl);
  const persona: Persona = {
    id,
    nombre: form.nombre.trim(),
    apodo: form.apodo.trim(),
    foto,
    circulo: form.circulo,
    cercania: Number(form.cercania),
    fuerza: 24,
    rasgo: form.rasgo.trim() || 'Aún no anotaste un rasgo para reconocerle.',
    donde: form.donde.trim() || 'Sin registrar',
    trabajo: 'Sin registrar',
    temas: form.temas,
    notas: form.notas.trim() || 'Sin notas todavía.',
    ultimoAt: Date.now(),
    encuentros: [
      { id: 'e' + Date.now(), fecha: 'Hoy', nota: 'Nos conocimos. ' + (form.donde.trim() || '') },
    ],
  };
  await db.personas.put(persona);
  try {
    await navigator.storage?.persist?.();
  } catch {
    // no bloquea el guardado si el navegador no soporta/otorga persistencia
  }
  return persona;
}

export async function actualizarPersona(id: string, form: PersonaForm): Promise<void> {
  const foto = form.fotoDataUrl ? await fotoDataUrlABlob(form.fotoDataUrl) : undefined;
  await db.personas.update(id, {
    nombre: form.nombre.trim(),
    apodo: form.apodo.trim(),
    ...(foto ? { foto } : {}),
    circulo: form.circulo,
    cercania: Number(form.cercania),
    rasgo: form.rasgo.trim() || 'Aún no anotaste un rasgo para reconocerle.',
    donde: form.donde.trim() || 'Sin registrar',
    temas: form.temas,
    notas: form.notas.trim() || 'Sin notas todavía.',
  });
}

export async function registrarEncuentro(id: string): Promise<void> {
  const p = await db.personas.get(id);
  if (!p) return;
  const encuentro = { id: 'e' + Date.now(), fecha: 'Hoy', nota: 'Nos vimos. Toca añadir el detalle.' };
  await db.personas.update(id, {
    ultimoAt: Date.now(),
    fuerza: Math.min(100, p.fuerza + 6),
    encuentros: [encuentro, ...p.encuentros],
  });
}

export async function responderRepaso(id: string, acerto: boolean): Promise<void> {
  const p = await db.personas.get(id);
  if (!p) return;
  const delta = acerto ? 10 : -7;
  await db.personas.update(id, { fuerza: Math.max(6, Math.min(100, p.fuerza + delta)) });
}

export async function borrarTodo(): Promise<void> {
  await db.personas.clear();
}

export async function exportarJSON(): Promise<string> {
  const personas = await db.personas.toArray();
  const conFotoBase64 = await Promise.all(
    personas.map(async (p) => ({
      ...p,
      foto: p.foto ? await blobABase64(p.foto) : undefined,
    }))
  );
  return JSON.stringify({ version: 1, exportadoEn: new Date().toISOString(), personas: conFotoBase64 }, null, 2);
}

function blobABase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
