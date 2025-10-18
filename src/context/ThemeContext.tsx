"use client"
import { createContext, useState } from "react"
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const ThemeContext = createContext({})

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
  const [ mode, setMode ] = useState('light')

  const toggle = () => {
    setMode((prev) => prev === 'light' ? 'dark' : 'light')
  }

  return(
    <ThemeContext.Provider value={{toggle, mode}}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${mode}`}
      >
        {children}
      </body>
    </ThemeContext.Provider>
  )
}