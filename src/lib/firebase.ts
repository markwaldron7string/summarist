import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getServerFirebaseConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

function isValidConfig(config: FirebaseClientConfig) {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId
  );
}

function readEmbeddedConfig(): FirebaseClientConfig | null {
  if (typeof document === "undefined") return null;

  const element = document.getElementById("__FIREBASE_CONFIG__");
  if (!element?.textContent) return null;

  try {
    return JSON.parse(element.textContent) as FirebaseClientConfig;
  } catch {
    return null;
  }
}

function readEnvConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

let runtimeConfig: FirebaseClientConfig | null = null;
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function setFirebaseConfig(config: FirebaseClientConfig) {
  runtimeConfig = config;
}

function resolveConfig(): FirebaseClientConfig | null {
  const candidates = [
    runtimeConfig,
    readEmbeddedConfig(),
    readEnvConfig(),
  ].filter(Boolean) as FirebaseClientConfig[];

  return candidates.find(isValidConfig) ?? null;
}

export function isFirebaseConfigured() {
  return resolveConfig() !== null;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;

  const config = resolveConfig();
  if (!config) return null;

  if (!app) {
    const options: FirebaseOptions = config;
    app = getApps().length > 0 ? getApp() : initializeApp(options);
    auth = getAuth(app);
  }

  return auth ?? null;
}
