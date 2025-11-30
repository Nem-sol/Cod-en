'use client'
import { Inboxes } from '@/types';
import { useSocket } from './SocketContext';
import { useUserContext } from './UserProvider';
import React, { createContext, useContext, useEffect, useState , Dispatch , SetStateAction } from "react";

interface InboxSet {
  err: string
  unread: number
  error: boolean
  loading: boolean
  isLoading: boolean
  inbox: Inboxes[] | never[]
  readMessages: ( id: string ) => void
  setRefresh: Dispatch<SetStateAction<boolean>>
  sendMessage: ( id: string , msg: string ) => void
  setInbox: Dispatch<SetStateAction< Inboxes[] | never[]>>
}

export const InboxContext = createContext<InboxSet | undefined>( undefined )

export const InboxProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  let unread = 0
  const [ err, setErr ] = useState('')
  const { socket, ready } = useSocket()
  const [ inbox, setInbox ] = useState<Inboxes[] | never[]>([])
  const [ error, setError ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  inbox.forEach((inb)=> unread += inb.messages.filter((msg) => user?.id === inb.userId ? !msg.sent && !msg.read : msg.sent && !msg.read ).length)

  // Fetch inbox on mount
  useEffect(() => {
    if (!user) return;
    setError(false)
    setIsLoading(true)
    const fetchInbox = async () => {
      try {
        const res = await fetch('/api/inbox/', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user.id}`,
          }
        });

        !res.ok && setError(true)
        res.ok && setInbox(await res.json())
      } catch (err) {
        setInbox([])
        setError(true)
        console.error("Failed to fetch user inbox", err);
      }
      setIsLoading(false)
    };
    fetchInbox();
  }, [ user , refresh ]);

  useEffect(()=>{

    if (!ready) return
    socket?.on('new-message', (inbx)=> {
      setLoading(false)
      setInbox((prev) => prev.map( inb => inb._id === inbx._id ? inbx : inb))
    })
    
    socket?.on('messages-read', ({ inboxId , me }) => {
      setInbox(prev => prev.map(inb => inb._id === inboxId ? {
          ...inb,
          messages: inb.messages.map( msg => {
            if ( me && !msg.sent ) return { ...msg, read: true }
            else if ( !me && msg.sent ) return { ...msg, read: true }
            else return msg
          }),
        } : inb
      ));
    })
    
    socket?.on('message-error', ( err ) => {
      setLoading(false)
      setErr(err?.message)
    });

    return () => {socket?.off('new-message'); socket?.off('messages-read'); socket?.off('message-error')}
  }, [ ready ])
  
  const sendMessage = ( inboxId: string , msg: string ) => {
    setErr('')
    const activeInbox = inbox.find( inb => inb._id === inboxId )
    if (!activeInbox) return setErr('Parent inbox not found')
    socket?.emit("send-message",  { inboxId, msg });
    setLoading(true)
  };
  
  const readMessages = ( inboxId: string ) => {
    setErr('')
    const activeInbox = inbox.find( inb => inb._id === inboxId )
    if (!activeInbox) return setErr('Parent inbox not found')
    socket?.emit("read-message", inboxId )
  }
  return(
    <InboxContext.Provider value={{ unread , loading , err , inbox, setInbox, isLoading, error , sendMessage, setRefresh , readMessages}}>
      { children }
    </InboxContext.Provider>
  )
}

export const useInboxContext = () => {
  const context = useContext(InboxContext)

  if (!context) throw new Error('useInboxContext must be used within an EmailProvider')

  return context
}