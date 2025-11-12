// src/db/mockFirestore.js

// ==============================
// 🔧 Mock Firestore completo
// ==============================

const localDB = {
  products: [],
  users: [],
  inventory: [],
  newsletter: [],
};

// Simula una referencia a documento
export const doc = (db, collectionName, id) => ({ collectionName, id });

// Simula una referencia a colección
export const collection = (db, collectionName) => ({ collectionName });

// Crea o sobrescribe un documento
export const setDoc = async (ref, data) => {
  const col = localDB[ref.collectionName] || [];
  const existingIndex = col.findIndex((item) => item.id === ref.id);
  if (existingIndex >= 0) {
    col[existingIndex] = { ...data, id: ref.id };
  } else {
    col.push({ ...data, id: ref.id });
  }
  localDB[ref.collectionName] = col;
  return Promise.resolve();
};

// Obtiene un documento
export const getDoc = async (ref) => {
  const col = localDB[ref.collectionName] || [];
  const doc = col.find((item) => item.id === ref.id);
  return {
    exists: () => !!doc,
    id: ref.id,
    data: () => doc || {},
  };
};

// Elimina un documento
export const deleteDoc = async (ref) => {
  const col = localDB[ref.collectionName] || [];
  localDB[ref.collectionName] = col.filter((item) => item.id !== ref.id);
  return Promise.resolve();
};

// Obtiene todos los documentos de una colección
export const getDocs = async (ref) => {
  const col = localDB[ref.collectionName] || [];
  return {
    docs: col.map((item) => ({
      id: item.id,
      data: () => item,
    })),
  };
};

// Filtros simulados
export const query = (ref, ..._args) => ref;
export const where = (field, op, value) => ({ field, op, value });
export const orderBy = (field, direction) => ({ field, direction });

// Escribe varias operaciones en batch
export const writeBatch = () => {
  const operations = [];
  return {
    set: (ref, data) => operations.push({ type: "set", ref, data }),
    delete: (ref) => operations.push({ type: "delete", ref }),
    commit: async () => {
      for (const op of operations) {
        if (op.type === "set") await setDoc(op.ref, op.data);
        if (op.type === "delete") await deleteDoc(op.ref);
      }
    },
  };
};

// =====================================================
// 🔧 Funciones adicionales usadas en el proyecto
// =====================================================

// Crea un documento nuevo con ID aleatorio
export const addDoc = async (ref, data) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newDoc = { id, ...data };
  if (!localDB[ref.collectionName]) localDB[ref.collectionName] = [];
  localDB[ref.collectionName].push(newDoc);
  return { id };
};

// Actualiza campos de un documento
export const updateDoc = async (ref, data) => {
  const col = localDB[ref.collectionName] || [];
  const idx = col.findIndex((d) => d.id === ref.id);
  if (idx >= 0) {
    col[idx] = { ...col[idx], ...data };
  }
  return Promise.resolve();
};

// getCollection — usado para cargar datos del JSON local
export const getCollection = async (collectionName) => {
  try {
    const response = await fetch(`/src/data/${collectionName}.json`);
    if (!response.ok) throw new Error(`No se pudo cargar ${collectionName}.json`);
    const data = await response.json();
    return {
      docs: Object.entries(data).map(([id, value]) => ({
        id,
        data: () => value,
      })),
    };
  } catch (error) {
    console.error(`Error en getCollection("${collectionName}")`, error);
    return { docs: [] };
  }
};

// Simula base de datos
export const db = localDB;
