import { useReducer, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'db/mockAuth';
import { doc, getDoc } from 'db/mockFirestore';
import { auth } from 'db/config';
import { db } from 'db/config';
import AuthContext from './auth-context';

const initialState = {
  user: null,
  name: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  addresses: [],
  isVerified: false,
  isAdmin: false,
  authIsReady: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_IS_READY':
      return {
        user: action.payload.user,
        name: action.payload.name,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber || null,
        addresses: action.payload.addresses || [],
        isVerified: true,
        isAdmin: action.payload.isAdmin || false,
        authIsReady: true,
      };
    case 'ANONYMOUS_AUTH_IS_READY':
      return { ...initialState, user: action.payload.user, authIsReady: true };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        name: action.payload.name,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber || null,
        addresses: action.payload.addresses || [],
        isVerified: true,
        isAdmin: action.payload.isAdmin || false,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'UPDATE_ADDRESSES':
      return { ...state, addresses: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Agregamos protección si onAuthStateChanged no devuelve una función
    const maybeUnsub = onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc && userDoc.exists()) {
            const userData = userDoc.data();
            dispatch({ type: 'AUTH_IS_READY', payload: { user, ...userData } });
          } else {
            dispatch({ type: 'ANONYMOUS_AUTH_IS_READY', payload: { user } });
          }
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Error en AuthProvider:', err);
        dispatch({ type: 'ANONYMOUS_AUTH_IS_READY', payload: { user: null } });
      }
    });

    // Si el mock devuelve una función, usarla. Si no, devolver noop.
    return typeof maybeUnsub === 'function' ? maybeUnsub : () => {};
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.authIsReady ? children : <div>Cargando...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
