"use client"
import { createContext, useState } from "react"

export const ThemeContext = createContext({})

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
  const [ mode, setMode ] = useState('light')

  const toggle = () => {
    setMode((prev) => prev === 'light' ? 'dark' : 'light')
  }

  return(
    <ThemeContext.Provider value={{toggle, mode}}>
      <body
        className={`antialiased ${mode}`}
      >
        {children}
      </body>
    </ThemeContext.Provider>
  )
}