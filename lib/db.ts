import Dexie, { type EntityTable } from 'dexie';
import type { Persona } from './types';

class VinculosDB extends Dexie {
  personas!: EntityTable<Persona, 'id'>;

  constructor() {
    super('vinculos');
    this.version(1).stores({
      personas: 'id, nombre, circulo, ultimoAt',
    });
  }
}

export const db = new VinculosDB();
