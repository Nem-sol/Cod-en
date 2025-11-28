import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google"
import AuthProvider from "../context/AuthProvider";
import { UserProvider } from '../context/UserProvider'
import { HelpProvider } from '../context/HelpProvider'
import { ThemeProvider } from '../context/ThemeContext'
import { InboxProvider } from "../context/InboxContext"
import { SocketProvider } from "../context/SocketContext"
import { ContactProvider } from '../context/MessageContext'
import { HistoryProvider } from '../context/HistoryContext'
import { ProjectProvider } from "../context/ProjectContext"
import { ProtectorProvider } from "../context/ProtectionProvider"
import { NotificationProvider } from '../context/NotificationContext'

export const metadata: Metadata = {
  title: "Cod-en | Future of web development",
  description: "Create your custom website in convience with Cod-en+",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className} ${inter.className}`}>
        <AuthProvider>
          <UserProvider>
            <SocketProvider>
              <HistoryProvider>
                <NotificationProvider>
                  <ProjectProvider>
                    <InboxProvider>
                      <HelpProvider>
                        <ContactProvider>
                          <ThemeProvider>
                            <ProtectorProvider>
                              {children}
                            </ProtectorProvider>
                          </ThemeProvider>
                        </ContactProvider>
                      </HelpProvider>
                    </InboxProvider>
                  </ProjectProvider>
                </NotificationProvider>
              </HistoryProvider>
            </SocketProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
