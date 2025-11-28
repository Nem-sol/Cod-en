"use client"
import { createContext, useEffect, useState } from "react"
import { classAdd, classRemove } from "../components/functions"


export const ThemeContext = createContext({})

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
  // const now = localStorage.getItem('theme')
  // const defaultTheme = now ? JSON.parse(now) : null

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
  }, [ mode ])

  return(
    <ThemeContext.Provider value={{ toggle , mode }}>
        {children}
    </ThemeContext.Provider>
  )
}