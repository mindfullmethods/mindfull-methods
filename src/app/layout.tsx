import "./globals.css";
import { ThemeProvider } from "@/components/components/theme-provider";
export const metadata = {
  title: "Mindfull Methods",
  description:
    "Premium Internship Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}