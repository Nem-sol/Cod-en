'use client'
import { Helps } from "@/types";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface HelpSet {
  error: boolean
  isLoading: boolean
  help: Helps[] | never[]
  setRefresh: Dispatch<SetStateAction<boolean>>
}
export const Help = createContext<HelpSet | undefined>( undefined )

export const HelpProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
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

export const useHelp = () =>{
  const context = useContext(Help);
  
  if (!context) throw new Error('useHelp must be used within an EmailProvider');
  
  return context;
}