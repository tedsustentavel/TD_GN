import "./globals.css";

export const metadata = {
  title: "Glossário de Negócios",
  description: "Glossário corporativo de termos, métricas e definições de negócios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
