import "./globals.css";

export const metadata = {
  title: "Portal de Governança de Dados",
  description: "Portal corporativo para governança de dados, incluindo glossário de negócios e dicionário de dados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
