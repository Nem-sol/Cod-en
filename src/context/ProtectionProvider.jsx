"use client";
import Navbar from "../components/Navbar"
import Heading from "../components/Header"
import { useHelp } from './HelpProvider';
import styles from '../app/main.module.css'
import { useSession } from 'next-auth/react';
import styl from '../app/inbox/page.module.css'
import LoadingBar from "../components/LoadingBar"
import { createContext , useEffect } from "react"
import style from '../app/contact/page.module.css'
import styz from '../app/recovery/page.module.css'
import { useProjectContext } from './ProjectContext'
import stylez from '../app/projects/new/page.module.css'
import { loaderCircleSvg } from "../components/svgPack";
import { useParams, usePathname , useRouter } from 'next/navigation';
import { CheckIncludes, FirstCase, RemoveAllClass, translateText } from '../components/functions';

const ProtectorContext = createContext();

export const ProtectorProvider = ({ children }) => {
  const router = useRouter()
  const path = usePathname()
  const { status } = useSession()
  const { id , slug } = useParams()
  const { help: helps } = useHelp()
  const help = helps.filter( p => p.slug === slug )
  const { project: projects } = useProjectContext()
  const project = projects.filter( p => p._id === id)[0]
  const unauthenticatedPaths = ['/','/signin', '/signup']
  const universalPaths = ['help', 'portfolio', 'blogs', 'contact', 'recovery']
  const authenticatedPaths = ['dashboard', 'notifications', 'tutorial', 'settings', 'projects', 'inbox', 'history']

  useEffect(()=>{
    router.prefetch('/')
    router.prefetch('/signin')
    router.prefetch('/dashboard')
  }, [])
  
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
          project ? project.title : 'Not found') : 
        'Not found'
      )
      translateText(`Cod-en | ${FirstCase(parts[1])} - ${sub}`, 'title')
    }
    else translateText('Cod-en', 'title')
  }, [ path , status ]);

  return (
    <ProtectorContext.Provider value={{}}>
      <Heading />
      <LoadingBar />
      <div className="root" style={{minHeight: status === 'loading' ? '0' : '100vh'}} onClick={(e) => {if (!['menu', 'menu div', 'menu button', 'menu span' ,`.${stylez.autoFill}`].some(sel => CheckIncludes(e, sel))) {
        RemoveAllClass(styz.inView, 'menu')
        RemoveAllClass(styl.inView, 'menu')
        RemoveAllClass(style.inView, 'menu')
        RemoveAllClass(styles.inView, 'menu')
        RemoveAllClass(stylez.inView, 'menu')
        RemoveAllClass('inView', 'menu')
      }}}>
        <Navbar />
        {status === 'loading' ? (
          <main id={styles.main}>
            <div className={`${styles.main} ${styles.default_bg}`}>
              <section className={style.background}></section>
              <h2 className='flex items-center gap-5 scale-[1.2]'>{loaderCircleSvg()} Loading Cod-en+ ... </h2>
            </div>
          </main>
        ) : 
        children}
        </div>
    </ProtectorContext.Provider>
  );
};
