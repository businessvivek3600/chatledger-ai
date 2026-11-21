import type { Metadata } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '../i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'ChatLedger AI - WhatsApp AI Operations, Invoicing & Lead Management',
  description:
    'Turn every WhatsApp conversation into appointment bookings, UPI payment tracking, and high-converting leads with ChatLedger AI enterprise operations.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-[#F7F8FA] text-[#202938]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
