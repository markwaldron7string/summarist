"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";

import {
  getFirebaseAuth,
  setFirebaseConfig,
  type FirebaseClientConfig,
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  isLocalAuthSession,
  markFirebaseAuthSession,
  readStoredUser,
} from "@/lib/authSession";
import { setUser } from "@/redux/slices/authSlice";
import type { SubscriptionType } from "@/redux/slices/authSlice";

function AuthListener({
  children,
  firebaseConfig,
}: {
  children: React.ReactNode;
  firebaseConfig: FirebaseClientConfig;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser && isLocalAuthSession()) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (isLocalAuthSession()) {
        const storedUser = readStoredUser();
        if (storedUser) {
          dispatch(setUser(storedUser));
        }
        return;
      }

      if (!firebaseUser?.email) return;

      const stored = localStorage.getItem("user");
      let subscription: SubscriptionType = "free-trial";

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.email === firebaseUser.email && parsed.subscription) {
            subscription = parsed.subscription;
          }
        } catch {
          // ignore malformed stored user
        }
      }

      markFirebaseAuthSession();
      dispatch(
        setUser({
          email: firebaseUser.email,
          subscription,
        })
      );
    });

    return () => unsubscribe();
  }, [dispatch, firebaseConfig]);

  return <>{children}</>;
}

export default function Providers({
  children,
  firebaseConfig,
}: {
  children: React.ReactNode;
  firebaseConfig: FirebaseClientConfig;
}) {
  setFirebaseConfig(firebaseConfig);

  return (
    <Provider store={store}>
      <AuthListener firebaseConfig={firebaseConfig}>{children}</AuthListener>
    </Provider>
  );
}
