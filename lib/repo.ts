import { db } from './db';
import type { Persona, PersonaForm } from './types';

/**
 * Capa de datos. Hoy pega a IndexedDB (Dexie); cuando exista backend,
 * sólo hay que reescribir el cuerpo de estas funciones para llamar a la API —
 * el resto de la app no conoce el detalle de almacenamiento.
 */

export async function listarPersonas(): Promise<Persona[]> {
  return db.personas.toArray();
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
    rasgo: form.rasgo.trim() || 'Aún no anotaste un rasgo para reconocerle.',
    donde: form.donde.trim() || 'Sin registrar',
    trabajo: 'Sin registrar',
    temas: form.temas,
    notas: form.notas,
    ultimoAt: Date.now(),
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
    notas: form.notas,
  });
}

export async function agregarNota(id: string, texto: string): Promise<void> {
  const limpio = texto.trim();
  if (!limpio) return;
  const p = await db.personas.get(id);
  if (!p) return;
  const nota = { id: 'nt' + Date.now(), texto: limpio, creadoEn: Date.now() };
  await db.personas.update(id, { notas: [nota, ...p.notas] });
}

export async function borrarNota(id: string, notaId: string): Promise<void> {
  const p = await db.personas.get(id);
  if (!p) return;
  await db.personas.update(id, { notas: p.notas.filter((n) => n.id !== notaId) });
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
