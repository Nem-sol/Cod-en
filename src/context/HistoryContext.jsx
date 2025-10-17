'use client'
import { useUserContext } from './UserProvider'
import { createContext, useContext, useEffect, useReducer, useState } from "react";

export const HistoryContext = createContext()

export const HistoryReducer = ( state , action ) => {
  switch (action.type) {
    case 'SET_HISTORY':
      return {
        history: action.payload
      }
    case 'CREATE_HISTORY' :
      return{
        history: [action.payload, ...state.history]
      }
    case 'UPDATE_HISTORY' : 
    return{
      history: [action.payload, ...state.history.filter((h)=> h._id !== action.payload._id)]
    }
    default:
      return state
  }
}
export const HistoryProvider = ({ children }) => {
  const [ state , dispatch ] = useReducer(HistoryReducer, {
    history: []
  })
  const [ error, setError ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(()=>{
    const fetchHistory = async () =>{
      setError(false)
      setIsLoading(true)
      try {
        const res = await fetch('/api/history/', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user.id}`,
          }
        });
        const result = await res.json()
        !res.ok && setError(true)
        res.ok && dispatch({type: 'SET_HISTORY', payload: result})
      } catch (error) {
        setError(true)
        console.log('Failed to fetch history')
      }
      setIsLoading(false)
    }
    user ? fetchHistory() : dispatch({type: 'SET_HISTORY', payload: []})
  }, [ user, refresh ])

  return(
    <HistoryContext.Provider value={{...state, dispatch, isLoading, error, setRefresh}}>
      { children }
    </HistoryContext.Provider>
  )
}

export const useHistoryContext = () => useContext(HistoryContext)