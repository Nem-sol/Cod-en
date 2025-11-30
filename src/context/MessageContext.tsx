'use client'
import { Message } from "@/types";
import { useUserContext } from "./UserProvider";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface ContactSet {
  error: boolean
  isLoading: boolean
  contact: Message[] | never[]
  setRefresh: Dispatch<SetStateAction<boolean>>
  setContact: Dispatch<SetStateAction< Message[] | never[]>>
}

export const Contact = createContext<ContactSet | undefined>( undefined )

export const ContactProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [ error, setError ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ contact, setContact ] = useState<Message[] | never[]>([])

  useEffect(()=>{
    const fetchContact = async () =>{
      setError(false)
      if ( !user || user?.role !== 'admin' ) {
        setContact([])
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch('/api/messages', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user.id}`,
          }
        });
        const result = await res.json()
        res.ok && setContact(result)
        !res.ok && setError(true)
      } catch (error) {
        setError(true)
        console.log('Failed to fetch contact messages')
      }
      setIsLoading(false)
    }
    fetchContact()
  }, [ refresh , user ])

  return(
    <Contact.Provider value={{ contact, isLoading, error, setRefresh , setContact }}>
      { children }
    </Contact.Provider>
  )
}

export const useContact = () => {
  const context = useContext(Contact);
  
  if (!context) throw new Error('useContact must be used within an EmailProvider');
  
  return context;
}