'use client'
import { useSocket } from './SocketContext';
import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from './UserProvider';

export const InboxContext = createContext()

export const InboxProvider = ({ children }) => {
  let unread = 0
  const { socket, ready } = useSocket()
  const [ inbox, setInbox ] = useState([])
  const [ error, setError ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  inbox.forEach((inb)=> unread += inb.messages.filter((msg) => user.id === inb.userId ? !msg.sent : msg.sent).length)

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
    socket.on('new-message', (msg)=> {
      setInbox((prev) => prev.map( inb => inb._id === msg.inboxId ? { ...inb , messages: [...inb.messages, msg]} : inb))
    })
    socket.on('messages-read', ({ inboxId }) => {
      setInbox(prev => prev.map(inb => inb._id === inboxId ? {
          ...inb,
          messages: inb.messages.map(msg => ({ ...msg, read: true })),
        } : inb
      ));
    });

    return () => {socket.off('new-message'); socket.off('messages-read')}
  }, [ socket ])
  
  const sendMessage = ( inboxId , msg ) => {
    const activeInbox = inbox.find( inb => inb._id === inboxId )
    const message = {
      content: msg,
      sent: activeInbox.userId === user._id ? true : false
    }
    socket.emit("send-message", { inboxId, message });
  };
  const readMessages = ( inboxId ) => {
    socket.emit("read-message", { inboxId } )
    setInbox((prev)=> prev.map( inb => inb._id === inboxId ? {
      ...inb,
      messages: [...inb.messages.map((msg)=>{ return user.id === inb.userId ?
        !msg.sent ? {...msg, read: true } : msg
      : user.role === 'admin' && msg.sent ? {...msg, read: true} : msg})]
    } : inb ))
  }
  return(
    <InboxContext.Provider value={{ unread , inbox, setInbox, isLoading, error , sendMessage, setRefresh , readMessages}}>
      { children }
    </InboxContext.Provider>
  )
}

export const useInboxContext = () => useContext(InboxContext)