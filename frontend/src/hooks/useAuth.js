import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  return {
    user,
    authReady,
    login: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth)
  };
}
