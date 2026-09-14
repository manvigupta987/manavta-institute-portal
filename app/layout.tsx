import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import Navbar from "../components/navbar";

// Google font configuration (website ke text ko premium look dene ke liye) 
const inter = Inter({ subsets: ["latin"] });

// SEO aur Browser Tab ke liye website ki settings [1]
export const metadata: Metadata = {
  title: "Manavta Institute Of Technology & Management",
  description: "Manavta Institute Of Technology & Management - Modern learning platform with Student Zone, interactive courses, and secure portal.",
};

// Main layout function jo website ke har page ko dhaanp kar rakhta hai
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full m-0 p-0">
      <body className={`${inter.className} w-full bg-slate-50 min-h-screen text-slate-900 antialiased`}>
        
        {/* 1. Global Navbar: Yeh header har page par upar hi rahega */}
        <Navbar />
        
        {/* 2. Page Content: Jo bhi page khulega (Home, Courses, Portal), wo yahan automatic fit ho jayega */}
        <main className="w-full p-0 m-0 flex-grow">

        {children}
        </main>
        
        
      </body>
    </html>
  );
}
