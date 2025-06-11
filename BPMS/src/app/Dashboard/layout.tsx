// app/layout.tsx (یا هر مسیری که Layout اصلی شماست)
import { Providers } from './providers'; // این فایل رو خودتون می‌سازید

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" suppressHydrationWarning dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}