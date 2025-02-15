export const metadata = {
    title: "MiaouX",
    description: "Le réseau social inspiré de X",
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body>{children}</body>
      </html>
    );
  }
  