import { Poppins } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: `${BRAND.name} · Remplacements médicaux`,
  description: "Organisez la continuité des soins entre médecins installés et remplaçants.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
