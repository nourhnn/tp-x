import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "MiaouX",
  description: "Le réseau social inspiré de X",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children} {/* Chaque page aura juste son contenu */}
      </body>
    </html>
  );
}

