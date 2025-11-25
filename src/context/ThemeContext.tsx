"use client"
import { useSocket } from './SocketContext';
import { useRouter } from "next/navigation";
import { useUserContext } from "./UserProvider"
import { useInboxContext } from "./InboxContext"
import { Notify } from "../components/pageParts"
import { Inter, Poppins } from "next/font/google"
import { useProjectContext } from "./ProjectContext"
import { Inboxes, Message, Projects } from '@/types';
import { signOut, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react"
import { useContact } from './MessageContext';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const ThemeContext = createContext({})

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
  // const now = localStorage.getItem('theme')
  // const defaultTheme = now ? JSON.parse(now) : null

  const router = useRouter()
  const { setContact } = useContact()
  const [ err, setErr ] = useState('')
  const { socket, ready } = useSocket()
  const { data: session } = useSession()
  const { setInbox } = useInboxContext()
  const [ reason, setReason ] = useState('')
  const { setProject } = useProjectContext()
  const [ mode, setMode ] = useState( 'light' )
  const [ notify , setNotify ] = useState(false)
  const [ changed , setChanged ] = useState(false)
  const { userDetails: user , error , deleted , setDeleted } = useUserContext()

  const toggle = () => {
    const now = mode
    const next = now === 'light' ? 'dark' : 'light'
    setMode( next )
    localStorage.setItem('theme', JSON.stringify({ theme: next }))
  }

  useEffect(()=>{
    if ( !user ) return
    if ( !error && (user.provider !== session?.user?.provider || user.email !== session?.user?.email) ){
      signOut()
      setChanged(true)
      router.push('/signin')
    }
  }, [ user ])

  useEffect(()=>{
    if (!ready) return
    socket.on("project-created", (project: Projects)=>{
      setNotify(true)
      setReason('created')
      setProject((prev: Projects[]) => [...prev, project])
    })

    socket.on("inbox-created", (project: Inboxes)=>{
      setInbox((prev: Inboxes[]) => [...prev, project])
    })

    socket.on('project-updated', (updated:  Projects)=> {
      setNotify(true)
      setReason('update')
      setProject((prev: Projects[]) => prev.map( p => p._id === updated._id ? updated : p))
    })

    socket.on('new-contact', ( message : Message ) => {
      setNotify(true)
      setReason('message')
      setContact((prev: Message[]) => [ message , ...prev ])
    })

    socket.on("project-error", ( error: {message: string} )=> {
      setNotify(true)
      setReason('error')
      setErr( error?.message)
    })

    return () => {
      socket.off('project-error')
      socket.off('project-created')
      socket.off('project-updated')
    }
  }, [ ready ])

  useEffect(() =>{
      const now = localStorage.getItem('theme')
      const defaultTheme = now ? JSON.parse(now) : null
      setMode( defaultTheme?.theme || "light" )
  }, [])

  return(
    <ThemeContext.Provider value={{toggle, mode}}>
      <body className={`antialiased ${mode} ${poppins.className} ${inter.className}`}>
        { deleted && <Notify message='User has been deleted. Please sign up' setCondition={setDeleted(false)} types='error' />}
        { changed && <Notify message='User settings changed across sessions. Please validate account ownership.' setCondition={setChanged(false)} types='error' />}
        { notify && <Notify message='New project created' setCondition={setNotify} types='success' condition={reason === 'created'} />}
        { notify && <Notify message='Latest project update successful' setCondition={setNotify} types='success' condition={reason === 'update'} />}
        { notify && <Notify message='You have a new message' setCondition={setNotify} condition={reason === 'message'} />}
        { notify && <Notify message={err || 'Error occured while creating project. Try again'} setCondition={setNotify} types='error' condition={reason === 'error'} />}
        {children}
      </body>
    </ThemeContext.Provider>
  )
}