import type { Metadata } from 'next';
import RootLayoutPage from '@Component/admin/container/rootLayout';

export const metadata: Metadata = {
  title: 'BPMS',
  description: 'Application BPMS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutPage>{children}</RootLayoutPage>;
}

