import "./globals.css";
import Providers from "./providers";
import AuthModal from "@/components/AuthModal";
import { getServerFirebaseConfig } from "@/lib/firebase";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseConfig = getServerFirebaseConfig();

  return (
    <html lang="en">
      <body>
        <script
          id="__FIREBASE_CONFIG__"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(firebaseConfig),
          }}
        />
        <Providers firebaseConfig={firebaseConfig}>
          <AuthModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
