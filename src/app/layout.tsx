import "./globals.css";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
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
      </html>
    </AuthProvider>
  );
}
