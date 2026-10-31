import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@picocss/pico";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ポロック相性診断アプリ",
  description: "もしもポケモン世界に迷い込んだら？18タイプであなたの性格と友達との相性を診断！",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
