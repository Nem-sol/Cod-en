'use client'
import { createContext, useContext, useEffect, useState } from "react";

export const Help = createContext()

export const HelpProvider = ({ children }) => {
  const [ help, setHelp ] = useState([])
  const [ error, setError ] = useState(false)
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(()=>{
    const fetchHelp = async () =>{
      setError(false)
      setIsLoading(true)
      try {
        const res = await fetch('/api/help/');
        const result = await res.json()
        res.ok && setHelp(result)
        !res.ok && setError(true)
      } catch (error) {
        setError(true)
        console.log('Failed to fetch help pages')
      }
      setIsLoading(false)
    }
    fetchHelp()
  }, [ refresh ])

  return(
    <Help.Provider value={{help, isLoading, error, setRefresh}}>
      { children }
    </Help.Provider>
  )
}

export const useHelp = () => useContext(Help)