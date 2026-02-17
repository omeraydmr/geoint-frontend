'use client';

import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <title>STRATYON - Strategic Intelligence Platform</title>
        <meta name="description" content="Strategic Intelligence Platform for Turkish Market" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8fafc" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <PrimeReactProvider value={{ ripple: true }}>
            <AuthProvider>
              <ChatbotProvider>
                {children}
              </ChatbotProvider>
            </AuthProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
