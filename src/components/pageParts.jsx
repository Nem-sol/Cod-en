'use client'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { signOut, useSession } from "next-auth/react"
import { ThemeContext } from '../context/ThemeContext'
import { useContext, useEffect, useState } from 'react'
import { useEmail } from '../context/ProtectionProvider'
import { useUserContext } from '../context/UserProvider'
import { useInboxContext } from '../context/InboxContext'
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckIncludes, classAdd, classRemove, classToggle, FirstCase, pick, pickAll, RemoveLikeClass, RemoveOtherClass, revAnimationTimeline, scrollCheck, Toggle } from './functions'
import { ReshuffleSvg, Githubsvg, Backsvg, Blogsvg, cancelSvg, Helpsvg, Inboxsvg, Javascriptsvg, Leftsvg, LogInSvg, LogoutSvg, Mailsvg, Nextsvg, Nightsvg, Nodesvg, ProjectSvg, Reactsvg, Rocketsvg, Rustsvg, Sunsvg, SupportSvg, TagSvg, loaderCircleSvg, TypeScriptsvg, Copysvg, checkmarkSvg, Devsvg, Linksvg, HTMLsvg, AppSvg, HomeSvg, dblRightArrowsvg, Packssvg, MenuShortSvg, Youtubesvg, Searchsvg, Infosvg, Refreshsvg, GlobeSvg, Vercelsvg, Bugsvg, Buildsvg, FolderSvg, PortfolioSvg, Facebooksvg, Xsvg, Sendsvg, HandShakeSvg } from './svgPack'


export function Back({ num = 1 }){
  const router = useRouter()
  const routes = window.history
  const number = 0 - Math.abs(Number(num)) || -1 // always negative
  const handleBack = () => {
    if ( routes.length < number * -1 ) {
      if (user) router.push('/dashboard')
      else router.push('/')
    } else routes.go( number )
  }
  return(
    <button onClick={handleBack}>{Backsvg()}<span>Back</span></button>
  )
}

export const HomeLink = ({children}) => {
  const { userDetails: user } = useUserContext()
  return <Link href={user ? '/dashboard' : '/'}>{children}</Link>
}

export const LogLink = () => {
  const { userDetails: user } = useUserContext()
  return <Link href={user ? '/dashboard' : '/signin'}>{user ? HomeSvg() : LogInSvg()}<span>{user ? 'Dashboard' : 'Log in'}</span></Link>
}

export const year = new Date().getFullYear()

export const ParamsText = ({ search , reverse = '', fallback, extra = '' }) => {
  const param = useSearchParams()
  const text = param.get( search || '' )
  
  return <p className='w-full text-center'> { text?.replaceAll(reverse , '') || fallback || "Failed to search params" } { extra } </p>
}

const ThemeToggle = () => {
  const { toggle , mode } = useContext(ThemeContext)
  return(
    <div id='theme' onClick={toggle}>
      <button>{Sunsvg()}</button>
      <button>{Nightsvg()}</button>
      <button className="identifier" style={{left: mode === 'light' ? '2.5px': 'calc(100% - 34px)'}}></button>
      <span> Alt + t </span>
    </div>
  )
}

export function UserNav(){
  const { unread } = useInboxContext()
  const { userDetails: user } = useUserContext()
  if (!user) return(
    <div className="user_pack">
      <p>Guest</p>
      <Link href='/signup'>Sign up</Link>
      <Link href='/signin'>Sign in</Link>
      <ThemeToggle />
    </div>
  )
  else if (user) return(
    <div className="user_pack">
      <p>{user.name}</p>
      <button className='button' onClick={()=>{classAdd('nav', 'inView'), classAdd('nav', 'inb')}}>
        {unread > 0 && <span className='bg-[var(--error)] rounded-full aspect-square min-w-5.5 text-[15px] flex items-center justify-center text-white -top-[5px] -right-[3px]' style={{position: 'absolute', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 2px 3px rgba(0, 0, 0, 0.2)'}}>{unread > 9 ? '9' : unread}</span>}
        {Inboxsvg('isBig')} Inbox
      </button>
      <button className='button' onClick={()=>signOut()} style={{color: 'var(--error)'}}>{LogoutSvg()}Log out</button>
      <ThemeToggle />
    </div>
  )
}

export function GuestNav(){
  const { userDetails: user } = useUserContext()
  if (!user) return(
    <div className="link_pack">
      <Link href='/help'>{Helpsvg()} Help</Link>
      <Link href='/blogs'>{Blogsvg()} Blogs</Link>
      <Link href='/portfolio'>{PortfolioSvg()} Portfolio</Link>
      <Link href='/contact'>{SupportSvg('isBig')} Contact</Link>
      <Link href='/payments'>{Packssvg('isBig')} Send gift</Link>
    </div>
  )
}

export function DropButton({props}) {
  const { status } = useSession()
  const isAuth = status === 'authenticated'

  const handleClick = (e) => {
    !CheckIncludes(e, '.link_pack') && !CheckIncludes(e, '.guest-button') && classRemove('.link_pack', 'inView')
  }

  useEffect(() => {
    window.addEventListener('click', handleClick)
    if( isAuth ) window.removeEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [status ])

  return (
    <button className='guest-button' onClick={()=>{
        if (!isAuth){
          classToggle('.link_pack', 'inView');
        } else classToggle('nav', 'inView')
      }}>
      {props.text}
    </button>
  )
}

export const PortfolioServiceNavButton = ({ styles }) => {
  return <button onClick={()=>classToggle(`.${styles.nav}`, styles.inView )}>{MenuShortSvg()}</button>
}

export function ProjectVid ({ styles }){
  const router = useRouter()
  const { userDetails: user } = useUserContext()
  return (
    <section className={styles.vid}>
      <h2> Cod-en project demo </h2>
      <section></section>
      <div>
        <a href="https://youtube.com" className={styles.yt} style={{ color: 'white', backgroundColor: 'rgb(231, 43, 43)' }}>{Youtubesvg()} <p>Watch on</p>Youtube</a>
        <button onClick={() => router.push(user ? '/projects/new' : '/signin' )}> <span>Create your new project</span>{Linksvg()}</button>
        <a href="https://github.com" className='ml-auto'>
        <span>View project code</span> {Githubsvg('isBig')}</a>
      </div>
    </section>
  )
}

export function PortfolioServiceLink(){
  const router = useRouter()
  const { userDetails: user } = useUserContext()
  const [ triggered , setTriggerd ] = useState(false)

  const handleRouting = ()=> {
    if (!triggered) return
    if ( user ) router.push('/projects/new')
    else router.push('/signup')
  }

  useEffect( handleRouting , [ triggered ])

  return (
    <button onClick={()=> setTriggerd(true) }>Create project</button>
  )
}

export function PortfolioServiceBanners ({ styles }) {
  const [ now , setNow ] = useState(0)
  const [ text , setText ] = useState('')
  const banners = [
    {img: '/network.png', callup: 'Solana DApps', p: 'Decentralised applications on the Solana mainnet'},
    {img: '/network.png', callup: 'Graphics design', p: 'Draw-en from Cod-en, your software graphics solution.'},
    {img: '/network.png', callup: 'Ne-tworks', p: 'Join Cod-en project network as a sub-independent web space'},
    {img: '/network.png', callup: 'Others ... ', p: "You don't want to wait till you see it, start creating now"},
  ]

  useEffect(()=>{
    const interval = setInterval(() => setNow((prev) => prev + 1 === banners.length - 1 ? 0 : prev + 1 ), 10000 )
    return () => clearTimeout(interval)
  }, [ ])

  useEffect(()=>{
    let txt = ''
    let wait = 0
    const time = 2500 / banners[now].p.length

    const interval = setInterval(()=>{
      if ( txt !== banners[now].p) {
        txt = banners[now].p.substring(0, txt.length + 1 )
        setText( txt )
      } else clearTimeout(interval)
    }, time )

    const timeout = setInterval(()=>{
      if ( txt === banners[now].p ) wait = wait + 1
    }, 1000 )

    const revInterval = setInterval(()=>{
      if ( txt === banners[now].p && wait >= 5 ) setText( prev => prev.slice( 0 , -1))
    }, time )

    return () => {
      clearTimeout(timeout)
      clearTimeout(interval)
      clearTimeout(revInterval)
    }
  }, [ now ])

  return <section className={styles.banners} style={{flexDirection: now % 2 ? 'row' : 'row-reverse'}}>
    <div>
      <h2>{banners[now]?.callup}</h2>
      <p>{ text }</p>
    </div>
    <div className={styles.img}> <Image src={banners[now].img} alt='callup-banner' fill={true} /></div>
  </section>
}

export function MediaCaptions () {
  const [ svg ,  setSvg ] = useState(Youtubesvg())
  const [ media ,  setMedia ] = useState('YouTube')
  const [ caption ,  setCaption ] = useState('Develop your programming skills from our open-source, code-along tutorials')
  const mediaArray = [
    {svg: Youtubesvg(), media: 'YouTube', caption: 'Develop your programming skills from our open-source, code-along tutorials'},
    {svg: Facebooksvg(), media: 'Facebook', caption: 'Follow us for more updates on our code-base and project updates'},
    {svg: Xsvg('big'), media: 'Twitter', caption: 'Get updated on our collaborations, plans, whitelists and social interactions on x'},
    {svg: Githubsvg('BIG'), media: 'Github', caption: 'Get source-code of our community projects and latest works'},
    {svg: Mailsvg(), media: 'Cod-en mail', caption: 'Write straight to us via email an receive prompt response'},
    {svg: SupportSvg('isBig'), media: 'Support', caption: 'Or contact our support team staight from our website'},
  ]

  useEffect(()=>{
    const mediaToggle = () => {
      const now = mediaArray.find((set)=> set.media === media )
      const index = mediaArray.indexOf(now) + 1
      const next = mediaArray[index] || mediaArray[0]
      setSvg(next.svg)
      setMedia(next.media)
      setCaption(next.caption)
    }
    const interval = setInterval(mediaToggle, 10000)
    return () => clearInterval(interval)
  })

  return <p> <span>{svg} {media}</span> <span>{caption}</span></p>
}

export function PortfolioLanguages({ styles }){
  const [ odd , setOdd ] = useState(false)
  const langs = [
    {svg: TypeScriptsvg()},
    {svg: Javascriptsvg()},
    {svg: HTMLsvg()},
    {svg: Rustsvg()},
  ]
  useEffect(()=>{
    const interval = setInterval(() => setOdd((prev) => !prev), 10000);
    return ()=> clearInterval(interval)
  }, [])

  return (
    <section style={{ zIndex: '0'}} className='flex justify-center'>
      <section className={styles.langs}>
        {langs.map(( btn , i )=> (
          <span key={i} className={ i % 2 ? ( odd ? styles.left : styles.right ) : ( !odd ? styles.left : styles.right ) }> {btn.svg} </span>
        ))}
      </section>
    </section>
  )
}

export function ProjectFeeds({ styles , style , home }){
  const router = useRouter()
  const [ type , setType ] = useState('')
  const [ rev , setRev ] = useState(false)
  const [ scale , setScale ] = useState('')
  const [ mine , setMine ] = useState(false)
  const [ search , setSearch ] = useState('')
  const [ result , setResult ] = useState([])
  const [ error , setError ] = useState(false)
  const [ service , setService ] = useState('')
  const [ notify , setNotify ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ provider , setProvider ] = useState('')
  const [ projects , setProjects ] = useState([])
  const [ refresh , setRefresh ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const [ notFound , setNotFound] = useState(false)
  const [ src , setSrc ] = useState('/network.png')
  const [ hasScrolled , setHasScrolled ] = useState(window.scrollY > window.innerHeight * 0.25 )
  const searched = search.trim() || type.trim() || scale.trim() || service.trim() || provider.trim() || mine || rev

  const ProjectSet = ({ project , id }) => {
    return <section className={styles.project} id={`p-${id}`}>
      <div style={{fontWeight: 700, fontSize: '1.3em', color: 'var(--strong)', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}><Image src={project?.ico || '/globe.svg'} alt={`${project.name || 'project'} logo`} width={35} height={35}/> {project?.name} </div>
      <div>{project?.about}</div>
      <span style={{borderBottomLeftRadius: '20px', borderBottomRightRadius: '5px'}}>{FirstCase(project?.service)}</span>
      <div>
        <span>{FirstCase(project?.type)}</span>
        {project?.link && <a href={project.link} target="_blank" rel="noopener noreferrer">{Linksvg()}</a>}
        <button onClick={()=>classToggle(`#p-${id}`, styles.inView)}> {MenuShortSvg()}
          <div className={styles.hidden}>
            <p style={{color: 'var(--deepSweetPurple)'}}>{project.scale ? `${project.scale}-scale project` : 'Scale not specified'}</p>
            <p>{project?.sector}</p>
            <p>{format(project?.createdAt , 'do MMM, yyyy')}</p>
          </div>
        </button>
      </div>
    </section>
  }

  const SearchTerms = ({ id , text , query , setQuery , buttons }) => {
    return <menu id={id} className={styles.options}>
      <button style={{
        borderTopRightRadius: query.trim() ? '0' : '20px',
        borderBottomRightRadius: query.trim() ? '0' : '7px' ,
        backgroundColor: query.trim() ? 'var(--natural)' : 'var(--noti)'
      }} onClick={()=>{ RemoveOtherClass( `#${id}`, styles.inView , `.${styles.options}`); classToggle(`#${id}`, styles.inView)}}> { text }{ query.trim() && ` - ${FirstCase(query)}`} </button>
      { query && <span className={styles.span} onClick={()=> setQuery('')}>{cancelSvg()}</span>}
      <div>
        {buttons.map((b, i)=> <span key={i} onClick={()=>setQuery(b.query)}>{b.svg}{FirstCase(b.text || b.query)}</span>)}
      </div>
    </menu>
  }

  const Trim = (focus) => focus.trim().toLocaleLowerCase()

  const shuffle = ( focus , num = 7 ) => {
    const arr = [ ...focus ]
    if ( !arr ) setProjects([])
    else if ( arr.length <= num ) setProjects( arr )
    else {
      for (let i = arr.length - 1; i > 0; i--) {
        const n = Math.floor(Math.random() * ( i + 1))
        [arr[i], arr[n]] = [arr[n], arr[i]]
      }
      setProjects( arr.slice( 0 , num ) )
    }
    setNotify(true)
  }

  const Filters = ( term ) => {
    let project
    const terms = Trim(term)

    if ( !searched ) project = projects
    else if ( searched && !Trim(terms)) project = result
    else project = result.filter((p)=> Trim(p?.name).includes(Trim(terms)))

    if (type) project = project.filter((p)=> Trim(p.type).includes(type))
    if (scale) project = project.filter((p)=> Trim(p.scale || '').includes(scale))
    if (service) project = project.filter((p)=> Trim(p.service).includes(service))
    if (mine) project = project.filter((p)=> p.userId === user?._id )
    if (rev) project = result.filter((p)=> !project.includes(p))

    if (project.length > 0) {
      if (notFound) setNotFound(false)
      return project.map((p, i)=> <ProjectSet id={i} key={i} project={p}/>)
    } else if ( error ) {
      if (notFound) setNotFound(false)
      return <menu className={styles.default_bg}>
      <h2> {} Could not fetch projects <p>Try restoring internet connection, reloading the feed or refreshing the page</p></h2>
      <button disabled={ loading } onClick={() => setRefresh((prev) => !prev)}> <span> Refresh feeds</span>{Refreshsvg()}</button>
    </menu>
    } else if ( loading ) {
      if (notFound) setNotFound(false)
      return <menu className={styles.default_bg}>
      <h2> {loaderCircleSvg()} Fetching projects <p>Please be patient while we load our projects...</p></h2>
    </menu>
    } else if ( !searched ) {
      if (notFound) setNotFound(false)
      return <menu className={styles.default_bg}>
        <h2> {Rocketsvg()} Projects stalling... <p>Cod-en is working on active projects. </p></h2>
        <button onClick={() => router.push(user ? '/projects/new' : '/signin' )}> <span>Create project</span>{Linksvg()}</button>
      </menu>
    } else {
      if (!notFound) setNotFound(true)
      return <menu className={styles.default_bg}>
      <h2> Could not find project. <p> Try searching for another project name </p></h2>
      <button onClick={() => router.push(user ? '/projects/new' : '/signin' )}> <span>Create project</span>{Linksvg()}</button>
    </menu>
    }
  }

  useEffect(()=>{
    const checkScroll = () => {
      const permit = window.innerHeight - 60 - pick(`.${styles.div}`)?.offsetWidth
      scrollCheck( styles.img , styles.feed , styles.pack , permit / 1.75 )
      if (window.scrollY >= window.innerHeight * 0.25) setHasScrolled(true)
      else setHasScrolled(false)
    }
    window.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [ ])

  useEffect(()=>{
    if ( loading ) setSrc('/static.png')
    else if ( error ) setSrc('/network.png')
    else if ( searched && notFound ) setSrc('/looking.png')
    else setSrc('/projects.png')
  }, [ error , loading , searched , notFound ])

  useEffect(()=>{
    (async ()=>{
      const fallbackFeeds = localStorage.getItem( "feeds" ) || []
      setError(false)
      setLoading(true)
      if ( result.length > 0 ) {
        setLoading(false)
        return shuffle( result )
      }
      document.cookie = `require=true; path=/; max-age=300`;
      const res = await fetch('/api/projects',{ method: 'GET' })
      if ( !res.ok ) {
        setError(true)
        shuffle( fallbackFeeds )
        setResult( fallbackFeeds )
      } else {
        const val = await res.json()
        shuffle( val )
        setResult( val )
        localStorage.setItem( "feeds", val )
      } setLoading(false)
    })()
  }, [ refresh ])

  return (
    <section className={styles.feed}>
      {notify && <Notify setCondition={setNotify} types='error' message='Failed to fetch. Using fallback feeds.' condition={ error && projects.length}/>}
      {notify && <Notify setCondition={setNotify} message='Project shuffled' condition={ !error && projects.length > 7 }/>}
      <div className={styles.search}>
        <input type="text" value={search} placeholder='Search projects by name' onChange={(e)=> setSearch(e.target.value)}/>
        <button>{Searchsvg()}</button>
      </div>
      <div className='flex gap-2.5 flex-wrap justify-end items-center' style={{fontSize: '15px'}}>
        <SearchTerms id={'type'} query={type} setQuery={setType} text={'Type'} buttons={[
          { query: 'full'},
          { query: 'part'} ]}/>
        <SearchTerms id={'service'} query={service} setQuery={setService} text={'Service'} buttons={[
          { svg: Bugsvg(), query: 'testing'},
          { svg: Buildsvg(), query: 'upgrade'},
          { svg: HandShakeSvg(), query: 'contract'},
          { svg: Devsvg(), query: 'transcript'},
          { svg: GlobeSvg(), query: 'web application'},
          { svg: AppSvg(), query: 'software', text: 'software application'},
        ]}/>
        <SearchTerms id={'scale'} query={scale} setQuery={setScale} text={'Scale'} buttons={[
          { svg: <svg className={styles.marker} style={{ width: '10px', height: '10px', marginInline: '2px'}}></svg>,query: 'small'},
          { svg: <svg className={styles.marker} style={{ width: '14px', height: '14px', marginLeft: '1px'}}></svg>,query: 'medium'},
          { svg: <svg className={styles.marker} style={{ width: '16px', height: '16px'}}></svg>,query: 'large'} ]}/>
        <SearchTerms id={'provider'} query={provider} setQuery={setProvider} text={'Provider'} buttons={[
          { svg: GlobeSvg(), query: 'domain'},
          { svg: Githubsvg('BIG'), query: 'github'},
          { svg: Vercelsvg('BIG'), query: 'vercel'} ]}/>
        <span className={home.options} onClick={(e)=> {setMine((prev) => !prev ); Toggle(e, home.clicked)}}> My projects </span>
        <span className={home.options} onClick={(e)=>{setRev((prev) => !prev ); Toggle(e, home.clicked)}}>Reverse</span>
      </div>
      <section className={styles.holder} style={{ minHeight: projects.length > 1 ? '40vw' : '400px' , minWidth: user ? '100%' : 'calc( 100vw - 40px )' }}>
        <menu id={style.fill} onClick={()=>classToggle(`#${style.fill}`, style.inView)} style={{ top: '10px', right: '10px', margin: '0', zIndex: 1, position: 'absolute' , borderRadius: '20px', borderBottomRightRadius: '5px' }}>
          <button>{Infosvg()} Info</button>
          <section className={style.autoFill}>
            <span><svg></svg> <span style={{ display: 'block' }}>Cod-en is responsible &quot;only&quot; for the creaton of website. Use of website is enirely out of our control. Please valiadte website authenticity while using them. <Link href='/help/projects' className='pl-1 text-[var(--deepSweetPurple)]'>Learn more</Link></span></span>
            <span><svg></svg> Projects fetch are provided for completed projects only</span>
            <span><svg></svg> Rights to use project name have been given by our users. Seek permission to do likewise </span>
          </section>
        </menu>
        <section className={styles.section}>
          { result.length > 7 && <button onClick={()=>shuffle( result )} className={styles.shuffle}> { ReshuffleSvg() } <span>Reshuffle feeds</span></button>}
          {Filters(search)}
        </section>
        <div className={styles.div}>
          <div className={styles.img}><Image src={src} fill={true} alt='project_illustration'/></div>
        </div>
      </section>
      { hasScrolled && <button className={styles.top} onClick={()=> window.scroll({ top: 0, behavior: 'smooth'})}>{Leftsvg('-rotate-90')}</button>}
    </section>
  )
}

export function DropUserButton() {
  const { unread } = useInboxContext()
  const { userDetails: user } = useUserContext()
  return (
    <button style={{height: '34px', width: '44px', backgroundColor: 'var(--sweetPurple)'}} onClick={()=>{classToggle('.user_pack', 'inView'); window.addEventListener('click', (e)=>{!CheckIncludes(e, '.user_pack') && !CheckIncludes(e, '.user_pack button') && !CheckIncludes(e, 'header div button:last-child') && classRemove('.user_pack', 'inView')})}}>
      {unread > 0 && <span className='bg-[var(--error)] rounded-full aspect-square min-w-5.5 text-[15px] flex items-center justify-center text-white -top-[5px] -right-[3px]' style={{position: 'absolute', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 2px 3px rgba(0, 0, 0, 0.2)'}}>{unread > 9 ? '9' : unread}</span>}
      <span className="pointer-events-none">{user ? user.name[0].toLocaleUpperCase() : 'G'}</span>
    </button>
  )
}

export function Copier ({props}){
  const [ copied , setCopied ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const copy = async () => {
    setLoading(true)
    await navigator.clipboard.writeText(props.text);
    setCopied(true);
    setLoading(false)
    setTimeout(() => setCopied(false), 1000)
  }
  return(
    <button onClick={copy}>{loading ? loaderCircleSvg() : copied ? checkmarkSvg() : Copysvg()}</button>
  )
}

export function NewFilterSets({props}){
  useEffect(()=>{
    pickAll(`#${props.id} span`).forEach( btn => btn.classList.remove(props.clicked))
    props.buttons.forEach(( btn , i) => props.query.toLocaleLowerCase() === btn.query.toLocaleLowerCase() && pickAll(`#${props.id} span`)[i +1].classList.add(props.clicked))
  }, [props.query])
  return(
    <menu id={props.id} className={props.cln ? props.cln : ''}>
        <span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)', backgroundColor: 'var(--sweetRed) !important'}} onClick={(e)=>{classToggle(`#${props.id}`, `${props.class}`); RemoveOtherClass(`#${props.id}`, `${props.class}`, 'menu')}}>
        {(props.query.trim() && props.query.length < 15) ? FirstCase(props.query): 'Filters'}
        </span>
      <div>
        {props.buttons.map(( btn, i)=> <span key={i} onClick={(e)=>{
          RemoveLikeClass(e, props.clicked, `#${props.id} span`)
          props.query.toLocaleLowerCase() === btn.query.toLocaleLowerCase() ? props.reset() : btn.reset();
          props.query.toLocaleLowerCase() === btn.query.toLocaleLowerCase() ? e.target.classList.add(props.clicked) : e.target.classList.remove(props.clicked)
        }}> {btn.txt} {props.query.toLocaleLowerCase() === btn.query.toLocaleLowerCase() && cancelSvg()}</span>
        )}
      </div>
    </menu>
  )
}

export function Notify({ condition = true, setCondition, timer = 5000 , message = 'Alert', types = 'notes'}){
  const time = Number(timer) || 5000
  const msg = String(message) || 'Notification'
  const [ display , setDisplay ] = useState(condition)
  useEffect(()=>{
    const delay = setTimeout(()=>{if (display) setCondition(false); setDisplay(false)}, time)
    return () => clearTimeout(delay)
  })
  if (display) return <span className='notify' style={{
    opacity: 1,
    top: '80px',
    right: '20px',
    maxWidth: '80%',
    fontWeight: 600,
    fontSize: '15px',
    minWidth: '200px',
    position: 'fixed',
    padding: '10px 15px',
    borderRadius: '25px',
    pointerEvents: 'none',
    borderBottomRightRadius: '5px',
    animation: `notify 1 ${time}ms linear forwards`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)',
    color: types === 'error' ? 'var(--error)' : types === 'success' ? 'var(--success)' : 'var(--compliment)',
    borderColor: types === 'error' ? 'var(--error)' : types === 'success' ? 'var(--success)' : 'var(--compliment)',
    backgroundColor: types === 'error' ? '#fad2d2' : types === 'success' ? '#d4f2a0' : 'var(--primary)'}}>{msg}</span>
}

export function NewDropSets({props}){
  useEffect(()=>{
    if (props.listen) return
    const listen = () => pick(`#${props.id}.${props.class}`) ? pick(`#${props.id} div`).style.height = `${(props.buttons.length) * 35 + (props.buttons.length) * 5 }px` : pick(`#${props.id} div`).style.height = '0px'
    window.addEventListener('click', listen)
    return () => window.removeEventListener('click', listen)
  })
  const active = props.buttons.filter(( btn ) => props.query.toLocaleLowerCase() === btn.query.toLocaleLowerCase())
  return(
    <menu id={props.id} className={props.cln ? props.cln : ''} onClick={()=>{props.click ? classAdd(`#${props.id}`, `${props.class}`) : classToggle(`#${props.id}`, `${props.class}`); RemoveOtherClass(`#${props.id}`, `${props.class}`, 'menu')}}>
      <span>
        { active.length > 0 ?  <> {active[0].svg} {active[0].txt} </> : <>{SupportSvg('BIG')} Message</>}</span>
      <div>
        {props.buttons.map(( btn , i )=> <span key={i} onClick={btn.func}> {btn.svg} {btn.txt} </span>
        )}
      </div>
    </menu>
  )
}

export const Defaultbg = ({props}) => {
  return (
    <div className={props.styles.default_bg}>
      <div>
        <Image src={props.img ? props.img : '/homehero.png'} fill={true} alt='' />
      </div>
      <h3>{props.h2}<p>{props.text}</p></h3>
    </div>
  )
}

export function DashboardSection({props}){
  const fallbackLink = props.title.split(' ').join(' ')
  useEffect(()=>{
    props.class && classAdd( `#${props.id}`, props.active)
  }, [ props.class ])
  return(
    <section id={props.id} onClick={(e)=>{classAdd( `#${props.id}`, props.active); RemoveLikeClass(e, props.active,  `.${props.moderator} section`)}}>
      <p><svg style={props.condition ? {backgroundColor: 'rgb(109, 190, 55)'} : {}}></svg> {props.title}</p>
      <div>
        {props.text}
        <Link href={props.address || '/dashboard'}>{props.link ? props.link : fallbackLink}</Link>
      </div>
    </section>
  )
}

export function HomeHero({props}){
  const [ em, setEm ] = useState('faster')
  const [ p, setP ] = useState('Transform your ideas into simple, efficient codes with our lightning-speed coding team')
  useEffect(()=>{
    function changeText(){
      if (em === 'faster'){
        setEm('neater')
        setP('Equip yourself with a readable, reusable and user-friendly programmes that keep working better')
      } else if (em === 'neater'){
        setEm('your way')
        setP('By trans-communicating ideas, we create your dream websites that suits your every taste')
      } else {
        setEm('faster')
        setP('Transform your ideas into simple, efficient codes with our lightning-speed coding team')
      }
    }
    const interval = setTimeout(()=> changeText(em), 10000)
    return ()=> clearInterval(interval)
  }, [ em ])
  return(
    <div className={props.class} id={props.id}>
      <div className={props.background}></div>
      <h2>
        <span className="smoothcover-left"></span>
        <strong>
          Code <em>{em}</em> with <label>Cod<span>-en+</span></label>
        </strong>
        <p>{p}</p>
      </h2>
      <div className={props.img}><Image src='/signup.png' fill={true} alt='hero_img' /></div>
      <Link href='/signup'>Get started {Leftsvg('big')}</Link>
    </div>
  )
}
export function Language({props}){
  const [ txt , setTxt ] = useState('')
  const [ texts , setTexts ] = useState('')
  const [ factor , setFactor ] = useState(0)
  const [ current , setCurrent ] = useState('Front-end')
  const [ msg , setMsg ] = useState(["Hi, How can we help you today?"])
  const [ currentArr , setCurrentArr ] = useState([ { svg: HTMLsvg(), text: 'HTML'}, { svg: Nextsvg(), text: 'Next'}, { svg: Reactsvg(), text: 'React'}])

  useEffect(()=>{
    const scroller = () => {
      pickAll(`.${props.set} h2`).forEach((i) => revAnimationTimeline(i, props.cls, window.innerHeight / 1.1 ))
      pickAll(`.${props.features} section`).forEach((i) => revAnimationTimeline(i, props.inView, window.innerHeight / 1.05 ))
    }
    window.addEventListener('scroll', scroller)
    return() => window.removeEventListener('scroll', scroller)
  }, [])

  useEffect(()=>{
    const change = () => {
      if (current === 'Front-end') {
        setCurrent('Back-end')
        classAdd(`.${props.lang} textarea`, props.now)
        setTxt("I'd like to create a new web application")
        setCurrentArr([
          { svg: Rustsvg(), text: 'Rust'},
          { svg: Nextsvg(), text: 'Next'},
          { svg: Nodesvg(), text: 'Node'},
        ])
      } else if (current === 'Back-end') {
        setTxt('')
        setTexts('')
        setCurrent('Integrations')
        classRemove(`.${props.lang} textarea`, props.now)
        setMsg( prev => [...prev, "I'd like to create a new web application"])
        setCurrentArr([
          { svg: HTMLsvg(), text: 'HTML'},
          { svg: Nextsvg(), text: 'Next'},
          { svg: Reactsvg(), text: 'React'},
        ])
       } else if (current === 'Integrations') {
        setTexts('')
        setCurrent('Front-end')
        setMsg(["Hi, How can we help you today?"])
        setCurrentArr([
          { svg: HTMLsvg(), text: 'HTML'},
          { svg: Nextsvg(), text: 'Next'},
          { svg: Reactsvg(), text: 'React'},
        ])
        setTimeout(()=> classAdd(`.${props.lang}`, props.first), 3000)
      }
    }
    const interval = setTimeout(change, 10000)
    const h = pick(`.${props.lang}`).offsetHeight
    setFactor(h / currentArr.length)
    return () => clearInterval(interval)
  }, [ current ])

  useEffect(()=>{
    const text = "I'd like to create a new web application"
    const textz = `import Users from "./UserModels"
import Messages from "./MessagesModels"
import connect from "./../utils/db"

export const POST = (req) => {
  const { senderId, message } = await req.body
  await connect()

  if( !senderId || ! message ) return
  const user = Users.findById( senderId )

  if( !user ) return

  await Messages.create({ senderId , message })

  creating message...
  Sending...
}`
    const time = 2000 / textz.length
    const interval = setTimeout(()=>{
      if (current === 'Front-end') setTxt( prev => text.substring(0, prev.length + 1 ))
    }, 100 )
    const int = setTimeout(()=>{
      if (current === 'Back-end') setTexts( prev => textz.substring(0, prev.length + 1 ))
    }, time )
    return () => {clearInterval(int); clearInterval(interval)}
  }, [ txt , texts, current ])
  return(
    <section className={props.lang}>
      <p className={props.button}>{current}</p>
      {currentArr.map((l, i)=>{
        const n = i ++
        const top = factor * n + 10
        const name = i % 2 ? 'left' : 'right'
        return <span key={i} className={props[name]} style={{ top: `${top}px` }}>{l.svg}{l.text}</span>
      })}
      <section>
        <textarea value={texts} readOnly></textarea>
        <menu className={props.section}>{msg.map((m, i)=> <p key={i} className={i % 2 ? props.l : props.r}>{m}</p>)}</menu>
      </section>
      <div> <p>{txt}</p> <button disabled={current === 'Back-end'}>{current.includes('end') ? current === 'Front-end' ? Sendsvg() : loaderCircleSvg() : checkmarkSvg()}</button> </div>
    </section>
  )
}
export function LanguageHero ({ props }){
  return ( 
    <>
      <div className={props.background2}></div>
      <section className={props.set} style={{height: 'calc( 100vh - 60px)', maxHeight: '1300px'}}>
        <h2>
          <span> <span>{Devsvg()}</span> Our Languages?</span>
          <p>We speak code.</p>
        </h2>
        <Link href='/portfolio/languages' className={props.a}> View coden languages {Linksvg('isBIg')}</Link>
        <Language props={props}/>
      </section>
    </>
  )
}
export function ServiceBanner({prop}){
  const props = prop
  const [ current , setCurrent ] = useState('Learn')
  const [ midScreen, setMidScreen ] = useState(true)
  const [ bigScreen, setBigScreen ] = useState(false)
  useEffect(()=>{
    const useScrollCheck = () => {
      bigScreen && scrollCheck(props.big, props.serviceBanner, props.service)
      midScreen && scrollCheck(props.mid, props.serviceBanner, props.service)
    }
    const resize = () =>{
      const width = window.innerWidth
      width >= 1100 ? setBigScreen(true) : setBigScreen(false)
      width >= 650 && width < 1100 ? setMidScreen(true) : setMidScreen(false)
      useScrollCheck()
    }
    resize()
    // useScrollCheck()
    function ChangeCurrent(current){
      if (current === 'Learn') setCurrent('Create')
      else if (current === 'Create') setCurrent('Develop')
      else if (current === 'Develop') setCurrent('Learn')
      else setCurrent('Learn')
    }
    setTimeout(()=> ChangeCurrent(current), 10000)
    window.addEventListener('resize', ()=>resize())
    window.addEventListener('scroll', ()=>useScrollCheck())
    if (current === 'Learn') {
      classAdd(`.${props.learn}`, props.isActive)
      bigScreen && classAdd(`.${props.develop}`, props.wasActive)
      midScreen && RemoveOtherClass(`.${props.learn}`, `${props.isActive}`, `.${props.mid} a`)
      bigScreen && RemoveOtherClass(`.${props.learn}`, `${props.isActive}`, `.${props.big} section`)
      bigScreen && RemoveOtherClass(`.${props.develop}`, `${props.wasActive}`, `.${props.big} section`)
    } else if (current === 'Create') {
      classAdd(`.${props.create}`, props.isActive)
      bigScreen && classAdd(`.${props.learn}`, props.wasActive)
      midScreen && RemoveOtherClass(`.${props.create}`, `${props.isActive}`, `.${props.mid} a`)
      bigScreen && RemoveOtherClass(`.${props.create}`, `${props.isActive}`, `.${props.big} section`)
      bigScreen && RemoveOtherClass(`.${props.learn}`, `${props.wasActive}`, `.${props.big} section`)
    } else {
      classAdd(`.${props.develop}`, props.isActive)
      bigScreen && classAdd(`.${props.create}`, props.wasActive)
      midScreen && RemoveOtherClass(`.${props.develop}`, `${props.isActive}`, `.${props.mid} a`)
      bigScreen && RemoveOtherClass(`.${props.develop}`, `${props.isActive}`, `.${props.big} section`)
      bigScreen && RemoveOtherClass(`.${props.create}`, `${props.wasActive}`, `.${props.big} section`)
    } 
    return ()=>{
      window.removeEventListener('resize', ()=>resize())
      window.removeEventListener('scroll', ()=>useScrollCheck())
    }
  })
  if (midScreen) {
    return(
      <div className={props.mid}>
        <Link href='/signup' className={props.learn}>Learn</Link>
        <Link href='/signup' className={props.create}>Create</Link>
        <Link href='/signup' className={props.develop}>Develop</Link>
        <p>There's room for everyone</p>
      </div>
    )
  } else if (bigScreen){
    return(
      <div className={props.big}>
        <section className={props.learn}>
          <h3><span>Learn</span>Join our tutorial classes with your preferred catalogue offer</h3>
          <div className={props.build}></div>
          <Link href='/signup'><span>Start learn-en</span>{Leftsvg()}</Link>
        </section>
        <section className={props.create}>
          <h3><span>Create</span>Get your jobs done under high priority</h3>
          <div className={props.build}></div>
          <Link href='/signup'><span>Start creating-en</span>{Leftsvg()}</Link>
        </section>
        <section className={props.develop}>
          <h3><span>Develop</span>Join us in the motion, let's make a cleaner internet</h3>
          <div className={props.build}></div>
          <Link href='/signup'><span>Start develop-en</span>{Leftsvg()}</Link>
        </section>
      </div>
    )
  } else return <></>
}
export function ServiceHero({props}){
  function ServicePack({prop}){
    return(
      <section className={props.service}>
        <div className={props.itemsPack}>
          <h3>{prop.svg} {FirstCase(prop.link)}</h3>
          {prop.content.map((i, index)=>(
          <div key={index}>
            <Link href='/signup'>{i.svg} {i.link}</Link>
            <p>{i.text}</p>
          </div>
          ))}
        </div>
        <Link href={prop.address} className={props.more}>{ prop.link !== 'tutorials' ? 'View more' : 'Coming soon'} {Leftsvg('big')}</Link>
      </section>
    )
  }
  return(
    <section className={props.set} id={props.service}>
      <h2>
        <span> <span>{AppSvg()}</span> Our Services?</span>
        <p>Explore what we can offer.</p>
      </h2>
      <Link href='/portfolio/services' className={props.a}> View coden services {Linksvg('isBIg')}</Link>
      <div className={props.serviceBanner}>
        <div className={props.servicesPack}>
          <ServicePack prop={{
            address: '',
            svg: TagSvg(),
            link: 'tutorials',
            content: [
              {link: 'CSS'},
              {link: 'HTML'},
              {link: 'Node'},
              {link: 'Next'},
              {link: 'Rust'},
              {link: 'React'},
              {link: 'Python'},
              {link: 'TypeScript'}
            ]
          }}/>
          <ServicePack prop={{
            svg: AppSvg(),
            address: '/portfolio/services',
            link: 'web development',
            content: [
              {link: 'Create a new Website', text: 'Create a new web application from scratch'},
              {link: 'Update an existing website', text: 'Modify and effect new changes to  your pre-coded software for better performance'},
              {link: 'Web Debugging and Cleaning', text: 'Spot bugs and issues in your software and get rid of them'},
              {link: 'API integration', text: 'Integrate your application with global tools for versitile functionalities'}
            ]
          }}/>
          <ServicePack prop={{
            svg: ProjectSvg(),
            link: 'idea structuring',
            address: '/portfolio/services',
            content: [
              {link: 'Transcripting', text: 'Change software Language frame-work'},
              {link: 'Partner Project', text: 'Hire a service for a part phase of your project'},
              {link: 'Product Advertisement', text: 'Create a project with us and get right to our personalised product advertisement across our ne-twork'},
              {link: 'Software Designs/ Structuring', text: 'User Interface design and patterns from creative tools that are easy to work with'},
            ]
          }}/>
        </div>
        <ServiceBanner prop={ props }/>
      </div>
    </section>
  )
}
export function FeaturesBanner({props}){
  function Transcripting(){
    const [ js , setJs ] = useState('')
    const [ ts , setTs ] = useState('')
    const text = '<input type="password" value={value} onChange={(e) => setValue(e.target.value)} />'
    const txt = '<input type="password" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />'
    useEffect(()=>{
      const interval = setInterval(()=>{
        const isTrue = pick(`#${props.script}`)?.classList.contains(props.inView) || false
        if (isTrue) {
          setTs( prev => txt.substring(0, prev.length + 1))
          setJs( prev => text.substring(0, prev.length + 1))
        } else {
          setTs( prev => prev.slice(0, -1))
          setJs( prev => prev.slice(0, -1))
        }
      }, 50)
      return () => clearInterval(interval)
    }, [])
    return(
      <section id={props.script}>
        <div>
          <p>Transcripting</p>
          <span className={props.l}>{js}</span>
          <span className='flex justify-center gap-5'>{Javascriptsvg()}{dblRightArrowsvg('rotate-180 BIG')}{TypeScriptsvg('big')}</span>
          <span className={props.r}>{ts}</span>
          <Link href="/help/services">Check it out {Leftsvg()}</Link>
        </div>
        <h2>Change programming language to suitable alternatives</h2>
      </section>
    )
  }function InAppPayments(){
    return(
      <section>
        <h2>Make secured in-app payments with Paystack and Flutterwave</h2>
        <div>
          <p>Secured payments</p>
          <Image src='/payment.png' alt='payment_illustration' fill={true}/>
          <Link href="/payments">Check it out {Leftsvg()}</Link>
        </div>
      </section>
    )
  }function InAppChats(){
    useEffect(()=>{
      let scrolling
      const scroller = () => {
        let interval
        if (pick(`#${props.chats}`)?.classList.contains(props.inView)) {
          if (scrolling) return
          scrolling = true
          const l = pick(`#${props.chats} .${props.left}`)
          const r = pick(`#${props.chats} .${props.right}`)
          l.style.top = l.style.top === '15%' ? '70%' : '15%'
          r.style.top = r.style.top === '70%' ? '15%' : '70%'
          interval = setTimeout(()=>{
            l.style.left = l.style.left === '15%' ? '70%' : '15%'
            r.style.left = r.style.left === '70%' ? '15%' : '70%'
            setTimeout(()=> scrolling = false , 2000)
          }, 2000)
        } else{
          clearInterval(interval)
        }
      }
      window.addEventListener('scroll', scroller)
      return () => window.removeEventListener('scroll', scroller)
    })
    return(
      <section id={props.chats}>
        <div>
          <p>In-app chats</p>
          <span className={props.l}></span>
          {Rocketsvg(`${props.left} ${props.svg}`)}{Rocketsvg(`${props.right} ${props.svg}`)}
          <span className={props.r}></span>
          <Link href="/signin">Check it out {Leftsvg()}</Link>
        </div>
        <h2>Our steady live-chatting ensures you're not left out on your project creation</h2>
      </section>
    )
  }
  return(
    <menu className={props.features}>
      <Transcripting />
      <InAppPayments />
      <InAppChats />
    </menu>
  )
}
export function Trigger({props}){
  const router = useRouter()
  const { setEmail } = useEmail()
  const [ em, setEm ] = useState('')
  return(
    <div className={props.trigger}>
      <h2>{Rocketsvg()} Get started</h2>
      <form className={props.input} onSubmit={(e)=>{e.preventDefault(); router.push('/signup')}}>
        <input type="email" name='email' value={em} autoComplete='true' placeholder='Enter email' onChange={(e)=>{setEmail(e.target.value); setEm(e.target.value)}}/>
        <button>{Mailsvg()}</button>
      </form>
      <section>
        <Link href='/contact'> {SupportSvg()} <span>Contact</span></Link>
        <Link href='/signup'> <span>Sign up</span></Link>
        <Link href='/signin'>{LogInSvg()}<span> Sign in</span></Link>
      </section>
    </div>
  )
}