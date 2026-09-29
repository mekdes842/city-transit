import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CityTransit ET - Public Transport Route & Fare Finder',
  description: 'Find public transit routes, fares, and stop sequences in Addis Ababa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}