import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "@/shared/components/StoreInitializer";
import { QueryProvider } from "@/shared/providers/query-provider";

export const metadata: Metadata = {
  title: "Погода у ваших містах",
  description: "Слідкуйте за погодою в обраних містах з детальними прогнозами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <QueryProvider>
          <StoreInitializer />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
