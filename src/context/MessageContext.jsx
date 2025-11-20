'use client'
import { useUserContext } from "./UserProvider";
import { createContext, useContext, useEffect, useState } from "react";

export const Contact = createContext()

export const ContactProvider = ({ children }) => {
  const [ error, setError ] = useState(false)
  const [ contact, setContact ] = useState([])
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

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
    <Contact.Provider value={{contact, isLoading, error, setRefresh}}>
      { children }
    </Contact.Provider>
  )
}

export const useContact = () => useContext(Contact)