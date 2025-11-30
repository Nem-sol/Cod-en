"use client"
import { useHelp } from './HelpProvider'
import Navbar from "../components/Navbar"
import Heading from "../components/Header"
import styles from '../app/main.module.css'
import { useSocket } from './SocketContext'
import { useContact } from './MessageContext'
import styl from '../app/inbox/page.module.css'
import { useUserContext } from "./UserProvider"
import { useInboxContext } from "./InboxContext"
import { Notify } from "../components/pageParts"
import LoadingBar from "../components/LoadingBar"
import style from '../app/contact/page.module.css'
import styz from '../app/recovery/page.module.css'
import stylz from '../app/payments/page.module.css'
import { useProjectContext } from './ProjectContext'
import { signOut, useSession } from "next-auth/react"
import { loaderCircleSvg } from "../components/svgPack"
import stylez from '../app/projects/new/page.module.css'
import { Helps, Inboxes, Message, Projects } from '@/types'
import { useParams, usePathname , useRouter } from 'next/navigation'
import { createContext , Dispatch , SetStateAction , useContext, useEffect, useState } from "react"
import { CheckIncludes, FirstCase, RemoveAllClass, translateText } from '../components/functions'

interface EmailSet {
  email: string,
  setEmail: Dispatch<SetStateAction<string>>
}

const ProtectorContext = createContext<EmailSet | undefined>( undefined )

export const ProtectorProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const router = useRouter()
  const path = usePathname()
  const { status } = useSession()
  const { id , slug } = useParams()
  const { help: helps } = useHelp()
  const { setContact } = useContact()
  const [ err, setErr ] = useState('')
  const { socket, ready } = useSocket()
  const { setInbox } = useInboxContext()
  const { data: session } = useSession()
  const [ email , setEmail ] = useState('')
  const { setProject } = useProjectContext()
  const [ reason, setReason ] = useState('')
  const [ notify , setNotify ] = useState(false)
  const [ changed , setChanged ] = useState(false)
  const help = helps.filter(( h: Helps )=> h.slug === slug )
  const { project: projects } = useProjectContext()
  const unauthenticatedPaths = ['/','/signin', '/signup']
  const project = projects.filter(( p: Projects )=> p._id === id)[0]
  const { userDetails: user , error , deleted , setDeleted } = useUserContext()
  const universalPaths = ['help', 'portfolio', 'blogs', 'contact', 'recovery']
  const authenticatedPaths = ['dashboard', 'notifications', 'tutorial', 'settings', 'projects', 'inbox', 'history']

  useEffect(()=>{
    router.prefetch('/')
    router.prefetch('/signin')
    router.prefetch('/dashboard')
  }, [])
  


  useEffect(()=>{
    if ( !user ) return
    if ( !error && (user.provider !== session?.user?.provider || user.email !== session?.user?.email) ){
      signOut()
      setNotify(true)
      setChanged(true)
      router.push('/signin')
    }
  }, [ user ])

  useEffect(()=>{
    if (!ready) return
    socket?.on("project-created", (project: Projects)=>{
      setNotify(true)
      setReason('created')
      setProject((prev: Projects[]) => [...prev, project])
    })

    socket?.on("inbox-created", (project: Inboxes)=>{
      setInbox((prev: Inboxes[]) => [...prev, project])
    })

    socket?.on('project-updated', (updated:  Projects)=> {
      setNotify(true)
      setReason('update')
      setProject((prev: Projects[]) => prev.map( p => p._id === updated._id ? updated : p))
    })

    socket?.on('new-contact', ( message : Message ) => {
      setNotify(true)
      setReason('message')
      setContact((prev: Message[]) => [ message , ...prev ])
    })

    socket?.on("project-error", ( error: {message: string} )=> {
      setNotify(true)
      setReason('error')
      setErr( error?.message)
    })

    return () => {
      socket?.off('project-error', ()=>{})
      socket?.off('project-created', ()=>{})
      socket?.off('project-updated', ()=>{})
    }
  }, [ ready ])

  useEffect(() => {
    const parts = [...path.split('/')]

    if (!universalPaths.includes(parts[1]) && status !== 'loading') {
      if (unauthenticatedPaths.includes(path) && status === 'authenticated') router.push('/dashboard')
      else if (authenticatedPaths.includes(parts[1].toLocaleLowerCase()) && status === 'unauthenticated') router.push('/signin')
    }

    if ( status === 'loading') translateText('Cod-en | Loading...', 'title')
    else if (path === '/') translateText('Cod-en | Future of web development', 'title')
    else if (parts[1] === 'api') translateText(`Coden | ${FirstCase(path.replaceAll('/','').replace('api', '').replace('auth', ''))}`, 'title')
    else if (!parts[2]) translateText(`Cod-en | ${FirstCase(parts[1])}`, 'title')
    else if (parts[2]) {
      const sub =  (
        parts[1] === 'history' ? 'Details' : 
        parts[1] === 'help' ? (help.length > 0 ? help[0].title : 'Not found') : 
        parts[1] === 'projects' ? (parts[2] === 'new' ? 'New' : 
          project ? project.name : 'Not found') : 
        'Not found'
      )
      translateText(`Cod-en | ${FirstCase(parts[1])} - ${sub}`, 'title')
    }
    else translateText('Cod-en', 'title')
  }, [ path , status ])

  return (
    <ProtectorContext.Provider value={{ email , setEmail }}>
      <Heading />
      <LoadingBar />

      { deleted && <Notify message='User has been deleted. Please sign up' setCondition={setDeleted(false)} types='error' />}
      { changed && <Notify message='User settings changed across sessions. Please validate account ownership.' setCondition={setChanged(false)} types='error' />}
      { notify && <Notify message='New project created' setCondition={setNotify} types='success' condition={reason === 'created'} />}
      { notify && <Notify message='Latest project update successful' setCondition={setNotify} types='success' condition={reason === 'update'} />}
      { notify && <Notify message='You have a new message' setCondition={setNotify} condition={reason === 'message'} />}
      { notify && <Notify message={err || 'Error occured while creating project. Try again'} setCondition={setNotify} types='error' condition={reason === 'error'} />}

      <div className="root" style={{minHeight: status === 'loading' ? '0' : '100vh', paddingBottom: status === 'unauthenticated' ? '0px' : ''}} onClick={(e: React.MouseEvent) => {if (!['menu', 'menu div', 'menu button', 'menu span' ,`.${stylez.autoFill}`].some(sel => CheckIncludes(e, sel))) {
        RemoveAllClass(styz.inView, 'menu')
        RemoveAllClass(styl.inView, 'menu')
        RemoveAllClass(style.inView, 'menu')
        RemoveAllClass(stylz.inView, 'menu')
        RemoveAllClass(styles.inView, 'menu')
        RemoveAllClass(stylez.inView, 'menu')
        RemoveAllClass('inView', 'menu')
      }}}>
        <Navbar />
        {status === 'loading' ? (
          <main id={styles.main} style={{alignSelf: 'center'}}>
            <div className={`${styles.main} ${styles.default_bg}`}>
              <section className={style.background}></section>
              <h2 className='flex items-center gap-5 scale-[1.2]'>{loaderCircleSvg()} Loading Cod-en+ ... </h2>
            </div>
          </main>
        ) : 
        children}
        </div>
    </ProtectorContext.Provider>
  )
}

export function useEmail() {
  const context = useContext(ProtectorContext);
  
  if (!context) throw new Error('useEmail must be used within an EmailProvider');
  
  return context;
}