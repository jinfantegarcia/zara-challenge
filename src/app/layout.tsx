import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Smartphone Store',
  description: 'Browse, search and shop a catalog of smartphones.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
