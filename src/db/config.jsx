import * as mockFirestore from './mockFirestore';
import * as mockAuth from './mockAuth';

export const db = mockFirestore;
export const auth = mockAuth;
export const storage = {}; // mock vacío para evitar errores de import
