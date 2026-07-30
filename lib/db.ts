import Dexie, { type EntityTable } from 'dexie';
import type { Ajustes, Persona } from './types';

class VinculosDB extends Dexie {
  personas!: EntityTable<Persona, 'id'>;
  ajustes!: EntityTable<Ajustes, 'id'>;

  constructor() {
    super('vinculos');
    this.version(1).stores({
      personas: 'id, nombre, circulo, fuerza, ultimoAt',
      ajustes: 'id',
    });
  }
}

export const db = new VinculosDB();
