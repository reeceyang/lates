import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/joy";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lates",
  description: "Request lates for house dinners at Xi Fellowship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CssBaseline>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </CssBaseline>
  );
}
