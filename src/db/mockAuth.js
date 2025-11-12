// mockAuth.js
// Simulación del módulo de autenticación de Firebase

export const auth = {
  currentUser: null,
  listeners: [],
};

// --- Sign in anónimo ---
export const signInAnonymously = async () => {
  const user = { uid: 'anon-' + Date.now(), isAnonymous: true };
  auth.currentUser = user;
  // Notificar a todos los listeners que hay un nuevo usuario
  auth.listeners.forEach((cb) => cb(user));
  return { user };
};

// --- Escuchar cambios de autenticación ---
export const onAuthStateChanged = (callback) => {
  if (typeof callback !== 'function') {
    console.error('onAuthStateChanged: callback no es una función válida');
    return () => {};
  }

  // Agregar el listener
  auth.listeners.push(callback);

  // Llamar inmediatamente si ya hay un usuario
  if (auth.currentUser) {
    callback(auth.currentUser);
  } else {
    // Si no hay usuario, crear uno anónimo por defecto
    signInAnonymously().then(({ user }) => callback(user));
  }

  // Retornar una función de "desuscripción"
  return () => {
    auth.listeners = auth.listeners.filter((cb) => cb !== callback);
  };
};

// --- Sign out ---
export const signOut = async () => {
  auth.currentUser = null;
  auth.listeners.forEach((cb) => cb(null));
};

// --- Crear usuario con email/password (simulado) ---
export const createUserWithEmailAndPassword = async (email, password) => {
  const user = {
    uid: 'user-' + Date.now(),
    email,
    password,
    isAnonymous: false,
  };
  auth.currentUser = user;
  auth.listeners.forEach((cb) => cb(user));
  return { user };
};

// --- Sign in con email/password (simulado) ---
export const signInWithEmailAndPassword = async (email, password) => {
  const user = { uid: 'user-' + Date.now(), email, password, isAnonymous: false };
  auth.currentUser = user;
  auth.listeners.forEach((cb) => cb(user));
  return { user };
};

// --- EmailAuthProvider (simulado) ---
export const EmailAuthProvider = {
  credential: (email, password) => ({ email, password }),
};

// --- linkWithCredential (simulado) ---
export const linkWithCredential = async (user, credential) => {
  const linkedUser = { ...user, ...credential, isAnonymous: false };
  auth.currentUser = linkedUser;
  auth.listeners.forEach((cb) => cb(linkedUser));
  return { user: linkedUser };
};
