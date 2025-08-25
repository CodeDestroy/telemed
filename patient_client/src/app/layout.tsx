import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Телемедицинские консультации",
  description: "Телемедицинские консультации",
};

/* export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <StoreContext.Provider value={store}>
          {children}
        </StoreContext.Provider>
      </body>
    </html>
  );
} */

import { StoreProvider } from '@/store'
import AuthProvider from "@/components/AuthProvider";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="ru" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <AppRouterCacheProvider>
          <StoreProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            
          </StoreProvider>
        </AppRouterCacheProvider>
        
      </body>
    </html>
  )
}
