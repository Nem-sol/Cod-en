'use client'
import { useUserContext } from './UserProvider'
import { createContext, useContext, useEffect, useReducer, useState } from "react";

export const Notification = createContext()

export const NotificationReducer = ( state , action ) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        notifications: action.payload
      }
    case 'UPDATE_NOTIFICATION' :
      return{
        notifications: [...state.notifications.map((n)=>{ 
          return n._id !== action.payload._id ? n : action.payload})]
      }
    case 'DELETE_NOTIFICATION' : 
    return{
      notifications: state.notifications.filter((n)=> n._id !== action.payload._id)
    }
    default:
      return state
  }
}
export const NotificationProvider = ({ children }) => {
  const [ state , dispatch ] = useReducer( NotificationReducer, {
    notifications: []
  })
  const [ error, setError ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const unread = [...state.notifications.filter( n => n.read === false)].length

  useEffect(()=>{
    const fetchNotifications = async () =>{
      setError(false)
      setIsLoading(true)
      try {
        const res = await fetch('/api/notifications/', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user.id}`,
          }
        });
        const result = await res.json()
        !res.ok && setError(true)
        res.ok && dispatch({type: 'SET_NOTIFICATIONS', payload: result})
      } catch (error) {
        setError(true)
        console.log('Failed to fetch notifications')
      }
      setIsLoading(false)
    }
    user ? fetchNotifications() : dispatch({type: 'SET_NOTIFICATIONS', payload: []})
  }, [ refresh , user ])

  return(
    <Notification.Provider value={{ ...state, dispatch, isLoading, error, setRefresh, unread }}>
      { children }
    </Notification.Provider>
  )
}

export const useNotificationContext = () => useContext(Notification)