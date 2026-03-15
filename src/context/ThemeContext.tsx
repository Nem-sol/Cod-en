"use client"
import { classAdd, classRemove } from "../components/functions"
import { createContext, useContext, useEffect, useState } from "react"

interface Themes {
  mode: string
  toggle: () => void
}

export const ThemeContext = createContext< Themes | undefined >( undefined )

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{

  const [ mode, setMode ] = useState( 'light' )

  const toggle = () => {
    const now = mode
    const next = now === 'light' ? 'dark' : 'light'
    setMode( next )
    classAdd( 'body' , mode )
    classRemove( 'body' , now)
    localStorage.setItem('theme', JSON.stringify({ theme: next }))
  }

  useEffect(() =>{
    const now = localStorage.getItem('theme')
    const defaultTheme = now ? JSON.parse(now) : null
    setMode( defaultTheme?.theme || "light" )
  }, [])

  useEffect(()=>{
    classAdd( 'body' , mode )
    const keyListener = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLocaleLowerCase() === 't') toggle()
    }
    window.addEventListener('keydown', keyListener)
    return () => window.removeEventListener('keydown', keyListener)
  }, [ mode ])

  return(
    <ThemeContext.Provider value={{ toggle , mode }}>
        {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const themes = useContext(ThemeContext)
  if (!themes) throw new Error(' Theme hook must be used in the Theme Provider.' )
  return themes
}