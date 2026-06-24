"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";

import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { setUser } from "@/redux/slices/authSlice";
import type { SubscriptionType } from "@/redux/slices/authSlice";

function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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

      dispatch(
        setUser({
          email: firebaseUser.email,
          subscription,
        })
      );
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}