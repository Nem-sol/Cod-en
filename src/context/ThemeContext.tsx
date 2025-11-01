"use client"
import { createContext, useState } from "react"
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const ThemeContext = createContext({})

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
  const [ mode, setMode ] = useState('light')

  const toggle = () => {
    setMode((prev) => prev === 'light' ? 'dark' : 'light')
  }

  return(
    <ThemeContext.Provider value={{toggle, mode}}>
      <body className={`antialiased ${mode} ${poppins.className} ${inter.className}`}>
        {children}
      </body>
    </ThemeContext.Provider>
  )
}