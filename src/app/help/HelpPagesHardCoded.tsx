'use client'
import Link from "next/link"
import Image from "next/image"
import styles from "./hardCodedStyles.module.css"
import { useTheme } from "@/src/context/ThemeContext"
import { FirstCase } from "@/src/components/functions"
import React, { useEffect, useRef, useState } from "react"
import { useUserContext } from "@/src/context/UserProvider"
import style from "././../portfolio/languages/page.module.css"
import { useProjectContext } from "@/src/context/ProjectContext"
import ChatInput, { EdittablePack } from "@/src/components/ChatBox"
import { BigBookSvg, Blogsvg, DeleteSvg, GlobeSvg, HistorySvg, HomeSvg, Imgsvg, Inboxsvg, loaderCircleSvg, Nightsvg, NotificationSvg, Padlocksvg, PlaySvg, ResourcesSvg, Rocketsvg, Searchsvg, ShortFlutter, ShortPayStackSvg, ShuffleSvg, Sunsvg, SupportSvg, TagSvg } from '@/src/components/svgPack'

type List = {
  answer: string
  question: string
}

export function AddHelp(){
  return (
    <section className={styles.page}>
      
    </section>
  )
}

export function Resources (){
  return (
    <section className={styles.page}>
      <section className="flex gap-5 flex-wrap">
        <section className={`${style['attribution-card']} ${styles.packs}`}>
          <div className={style['card-header']}>
            {ResourcesSvg('min-h-7 min-w-7 text-[#240e4e]')} <h2 className='text-[1.5em] font-bold'>Fonts &amp; Typography</h2>
          </div>
          <div className={style['library-category']}>
            <h4 className={styles.themeTalk}>
              <span>Poppins Font Family</span>
              <p> Inter Font Family ( Fallback font ) </p>
            </h4>
            <div className='flex gap-5 flex-wrap'>
              <p><span >OFL License</span></p>
              <p><span>Google Fonts</span></p>
              <p><span>Next/Font Google</span></p>
            </div>
          </div>
          <p className="opacity-[0.7]">Primary typography throughout the application ( as used via next/font/google ) </p>
          
          <div className={styles["code-snippet"]}>
            <code>{`import { Inter, Poppins } from "next/font/google"`}</code>
          </div>

          <div className={styles["code-snippet"]}>
            <code>{'const inter = Inter({ '}</code>
            <code className="ml-5">{'subsets: ["latin"],'}</code>
            <code className="ml-5">{'weight: ["400", "500", "600", "700"],'}</code>
            <code>{'});'}</code>
            <code className="mt-4">{'const poppins = Poppins({'}</code>
            <code className="ml-5">{'subsets: ["latin"],'}</code>
            <code className="ml-5">{'weight: ["400", "500", "600", "700"],'}</code>
            <code>{'});'}</code>
          </div>

          <div className={styles["code-snippet"]}>
            <code>{"<html lang='en'>"}</code>
            <code className="ml-5">{"<body className={`antialiased ${poppins.className} ${inter.className}`}>"}</code>
            <code className="ml-10">{"<AuthProvider>..."}</code>
            <code className="ml-5">{"</body>"}</code>
            <code>{"</html>"}</code>
          </div>

          <p className="opacity-[0.7]"> Use this if via css link </p>

          <div className={styles["code-snippet"]}>
            <code style={{ wordBreak: 'break-all' }}>&lt;link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&amp;display=swap"&gt;</code>
          </div>

          <div className={styles["code-snippet"]}>
            <code style={{ wordBreak: 'break-all' }}>&lt;link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap"&gt;</code>
          </div>
          <a href="https://fonts.google.com/specimen/Poppins" target="_blank" rel="noopener noreferrer" className={styles.link}>View on Google Fonts</a>
        </section>

        <section className={`${style["attribution-card"]} ${styles.packs}`}>
          <div className={style["card-header"]}>
            {Imgsvg('min-h-7 min-w-7 text-[#240e4e]')} <h2 className='text-[1.5em] font-bold'>Illustrations &amp; Graphics</h2>
          </div>

          <div className={style["library-category"]}>
            <h4>FreePik Illustrations</h4>

            <div className='flex gap-5 flex-wrap'>
              <p><span >MIT / CC </span></p>
              <p><span>FreePik</span></p>
            </div>

            <p className='opacity-[0.7]'>Application illustrations, empty states, and visual elements</p>

            <a href="https://freepik.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Visit FreePik</a>
          </div>

          <div className={style["library-category"]}>
            <h3>SVG Icon Collections</h3>
            
            <div className='flex gap-5 flex-wrap'>
              <p><span >MIT </span></p>
              <p><span>Multiple Sources</span></p>
              <p><span>Google Icons</span></p>
            </div>
            
            <p>Interface icons, buttons, and indicators from:</p>
            <ul className="resource-list">
              <li><a href='https://fonts.google.com/icons'>Google Icons</a></li>
              <li><p>Drawen</p></li>
              <li><a href='https://lineicons.com'>Line icons</a></li>
              <li><a href='https://iconfinder.com'>Icon finder</a></li>
            </ul>
          </div>
          
          <div className={style['library-category']}>
            <h4>Google Material Icons</h4>
            <div className='flex gap-5 flex-wrap'>
              <p><span >Apache 2.0</span></p>
              <p><span>Google Icons</span></p>
            </div>
            <p className="opacity-[0.7]">UI icons and interface elements</p>
            <div className={styles["code-snippet"]}>
              <code style={{ wordBreak: 'break-all' }}>&lt;link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"&gt;</code>
            </div>
          </div>
        </section>

        <section className={`${style['attribution-card']} ${styles.packs}`} style={{ flexWrap: 'wrap' , flexDirection: 'row' }}>
          <div className={style["card-header"]} style={{ width: '100%' }}>
            {TagSvg('isBig min-h-7 min-w-7 text-[#240e4e]')} <h2 className='text-[1.5em] font-bold'> Payments &amp; Billing </h2>
          </div>

          <div className={style['library-category']} style={{ marginBottom: '20px' }}>
            <h4 className={styles.themeTalk}>
              <span> Gifts </span>
              <span> Subscriptions </span>
              <p> Project payments </p>
            </h4>
            <div className='flex gap-5 flex-wrap'>
              <p><span >USD</span></p>
              <p><span>NGN</span></p>
              <p><span>GHS</span></p>
            </div>
            <p className="opacity-[0.7]">Cod-en allows payments in the pre-listed currencies via PayStack. </p>

            <a href="https://paystack.com" target="_blank" rel="noopener noreferrer" className={`flex gap-2.5 items-center ${styles.link}`}>{ShortPayStackSvg()} Visit Paystack</a>
          </div>

          <div className={style['library-category']}>
            <h4 className={styles.themeTalk}>
              <span> Gifts </span>
              <span> Subscriptions </span>
              <p> Project payments </p>
            </h4>
            <div className='flex gap-5 flex-wrap'>
              <p><span >USD</span></p>
              <p><span>NGN</span></p>
              <p><span>GHS</span></p>
              <p><span>KES</span></p>
            </div>
            <p className="opacity-[0.7]">Cod-en allows payments in the pre-listed currencies via Flutterwave. </p>

            <a href="https://app.flutterwave.com" target="_blank" rel="noopener noreferrer" className={`flex gap-2.5 items-center ${styles.link}`}> {ShortFlutter()} Visit Flutterwave</a>
          </div>

          <h2 className='w-full'>Learn more on <Link href='/help/payments' className='text-[#7c3aed]'>Cod-en payments</Link></h2>
        </section>
      </section>
    </section>
  )
}

export function FAQs () {
  const [ ask , setAsk ] = useState( '' )
  const [ err , setErr ] = useState( '' )
  const [ rev , setRev ] = useState(true)
  const [ load , setLoad ] = useState(false)
  const { userDetails: user } = useUserContext()
  const [ loading , setLoading ] = useState(false)
  const [ faqs , setFaqs ] = useState<List[] | never[]>([])

  const handleAsk = ( e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setErr('')
    if ( loading ) return
    const { value } = e.target
    setAsk( value.replaceAll('  ', ' '))
  }

  const handleSend = async () => {
    setErr('')
    if ( !ask.trim() ) return setErr('Ask a question')
    try {
      setLoading(true)
      const res = await fetch(`/api/faq`, {
        method: 'POST',
        body: JSON.stringify({ question: ask }),
        headers: { "Content-Type" : "application/json" },
      })

      const sent =  await res.json()
      if ( res.ok ) setAsk('')
      else setErr( sent.error )
      setLoading(false)
    } catch {
      setLoading(false)
      setErr('Failed to ask question.')
    }
  }

  const FAQSet = ({ faq }: { faq: List }) => {
    const [ show , setShow ] = useState(true)
    const [ editting , setEditting ] = useState(false)
    const [ reply , setReply ] = useState(faq.answer || '')

    const handleChange = ( e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target
      if ( user?.role !== 'admin' ) return
      setReply( value.replaceAll('  ', ' '))
    }

    return (
      <section className={`${styles.route} ${styles.faq}`} style={{ paddingInline: '15px' }}>
        <div className={styles.svg}>{Searchsvg()}</div>
        <div style={{ gap: '12px' }}>
          <h2>{ faq.question }</h2>
          <EdittablePack text={reply} style={{ opacity: '0.7' }} value={faq.answer || '** Unaswered question **'} placeholder='Reply question ( Admin only )' editting={editting && user?.role === 'admin' } onChangeArea={ handleChange } />

          { user?.role === 'admin' && <div className={styles.a}>
            <button onClick={()=> setEditting( prev => !prev )}>{SupportSvg()}</button>
            <button onClick={()=> setEditting( prev => !prev )}>{DeleteSvg()}</button> 
          </div> }
        </div>
      </section>
    )
  }

  useEffect(()=>{
    const getFaqs = async () => {
      try {
        setLoad(true)
        const res = await fetch(`/api/faq`)
        const list =  await res.json()
        if ( res.ok ) setFaqs( list )
        if ( list.length < 1 ) setFaqs([
          { question: 'How do I go home?' , answer: 'Navigate through the side-nav or follow the routing page'},
          { question: 'How do I change password?' , answer: 'Click the pen icon on the settings page or recover account to reset password'},
          { question: 'What is Cod-en?' , answer: 'We are a web-development project '},
        ])
        setLoad(false)
      } catch { setLoad(false) }
    }
    getFaqs()
  }, [])

  return (
    <section className={styles.pages}>
      { user?.role === 'admin' && <button className={styles.ask} style={{ alignSelf: 'end' }} onClick={()=> setRev( prev => !prev )}> { rev ? 'Una' : 'A' }swered questions </button> }
      { load ? (
        <section className={styles.loads}>
          <div className={styles.img}>
            <Image fill={true} alt='loading' src='/homehero.png' />
          </div>
          <h2>
            {loaderCircleSvg('self-end')}
            <p> Getting FAQs {} </p>
            <span> We know what you may need. Wait while we get it. </span>
          </h2>
        </section>
      ) : faqs.length < 1 ? (
        <section className={styles.loads}>
          <div className={styles.img}>
            <Image fill={true} alt='loading' src='/homehero.png' />
          </div>
          <h2>
            {Searchsvg('self-end')}
            <p> Oops. We could not get you our FAQs </p>
            <span> Don't worry you can throw your questions on the block and get answers as soon as possible. </span>
          </h2>
        </section>
      ) : (
        <section className="flex gap-5 flex-wrap">
          {faqs.filter(( faq: List ) => rev ? faq.answer.trim() : !faq.answer.trim() ).map(( faq: List , i: number ) => <FAQSet key={i} faq={faq} />)}
        </section>
      )}

      <section className={styles.ask}>
        <div className="flex gap-1 flex-1 flex-col">
          <ChatInput value={ask} onChange={handleAsk} maxHeight='75px' placeholder='Ask a question'/>
          <p className={styles.error}> {err} </p>
        </div>
        <button onClick={handleSend}> { loading ? loaderCircleSvg() : SupportSvg() } </button>
      </section>
    </section>
  )
}

export function Routing() {
  const index = useRef(0)
  const { mode } = useTheme()
  const before = useRef(mode)
  const { project } = useProjectContext()
  const { userDetails: user } = useUserContext()
  const [ animativeMode , setAnimativeMode ] = useState(mode)

  useEffect(()=>{
    if ( before.current === mode ) index.current++

    let next = mode
    let now = animativeMode
    let txt = animativeMode

    const interval = setInterval(()=>{
      if ( txt !== '' ) {
        txt = txt.slice( 0 , -1)
        now = now.slice( 0 , -1)
        setAnimativeMode( txt )
      }
      else if ( next !== now ) {
        now = next.substring( 0 , now.length + 1 )
        setAnimativeMode( now )
      } else {
        if ( index.current === 0 ) {
          before.current = mode
          clearInterval(interval)
        } else {
          index.current = 0
          now = next = mode
          txt = animativeMode
        }
      }
    }, 200 )

    return () => clearInterval(interval)

  }, [ mode ])

  return (
    <div className={styles.pages}>
      <section className={styles.routing}>
        <h1> <span className={styles['icon-wrapper']}>{Rocketsvg()}</span> <p> Navigation Guide</p> </h1>
        <p className="pl-5 w-full font-[600] text-[16px] text-[#2d27a4]">Navigate across the following pages available to you. </p>
        <section className={styles.route}>
          <div className={styles.svg}>{ResourcesSvg()}</div>
          <div>
            <h2>Portfolio</h2>
            <p>Get an overview of Cod-en, our projects, skills, socials, services and team. </p>
            <div className={styles.a}>
              <Link href='/portfolio'>Portfolio</Link>
              <Link href='/portfolio/socials'>Socials</Link>
              <Link href='/portfolio/services'>Services</Link>
              <Link href='/portfolio/languages'>Languages</Link>
              <Link href='/portfolio/projects'>Projects</Link>
            </div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{Searchsvg()}</div>
          <div>
            <h2>Helps</h2>
            <p>Get answers to common questions relating to the use and operation of Cod-en+ services.</p>
            <div className={styles.a}>
              <Link href='/help/terms'>Terms</Link>
              <Link href='/help/payment'>Payments</Link>
              <Link href='/help/project'>Project</Link>
              <Link href='/help/faq'>FAQs</Link>
            </div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{Padlocksvg()}</div>
          <div>
            <h2>Authentication</h2>
            <p>{ user ? 'Manage' : 'Access' } your cod-en account { user ? 'and configure settings' : 'by email , Google or Github sign in from any device' } to continue with Cod-en. </p>
            <div className={styles.a}>
              { user && <Link href='/settings'>Settings</Link>}
              { !user && <Link href='/signin'>Sign In</Link>}
              { !user && <Link href='/signup'>Sign Up</Link>}
              <Link href='/recovery'>Account Recovery</Link>
            </div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{SupportSvg()}</div>
          <div>
            <h2>Contact</h2>
            <p>{ user?.role === 'admin' ? 'Connect to users and guests through mail sending and replies via our website.' : 'Reach out to Cod-en right on our website or via provided alternatives.' }</p>
            <div className={styles.a}> <Link href='/contact'> Contact → </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{TagSvg()}</div>
          <div>
            <h2>Payments</h2>
            <p>{ user ? 'Make in-app payments for subscriptions, projects or' : '' } Support Cod-en with gift tokens.</p>
            <div className={styles.a}> <Link href='/payments'> Payments → </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{ user ? HomeSvg() : GlobeSvg() }</div>
          <div>
            <h2> { user ? 'Dashboard' : 'Home page' } </h2>
            <p> { user ? 'Get a preview of your account activity and quick access from your dashboard.' : 'Welcome to Cod-en. Get an overview of Cod-en from our landing page.' } </p>
            <div className={styles.a}> <Link href={ user ? '/dashboard' : '/' }> { user ? 'Dashboard' : 'Home' } → </Link></div>
          </div>
        </section>

        { user && <>
        <section className={styles.route}>
          <div className={styles.svg}>{BigBookSvg()}</div>
          <div>
            <h2>Projects</h2>
            <p>Create, view and manage your projects with Cod-en. </p>
            <div className={styles.a}>
              <Link href='/projects'>Projects</Link>
              <Link href='/projects/new'>Create</Link>
              { project.map(( proj , i: number ) => {
                if ( i === 0 ) return <Link href={`/projects/${proj.name}`}>{proj.name}</Link>
              }) }
            </div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{NotificationSvg()}</div>
          <div>
            <h2>Notifications</h2>
            <p> Get, read and delete notifications from account activity and global changes.</p>
            <div className={styles.a}> <Link href='/notifications'> Notifications → </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{HistorySvg()}</div>
          <div>
            <h2>History</h2>
            <p> Track record of important activities of your account from the history page </p>
            <div className={styles.a}><Link href='/history'> History → </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{Inboxsvg()}</div>
          <div>
            <h2>Inbox</h2>
            <p> Share your ideas and communicate with the cod-en team to maximize your project personalization and idea-matching. </p>
            <div className={styles.a}><Link href='/inbox'> Inbox → </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{PlaySvg()}</div>
          <div>
            <h2>Tutorials</h2>
            <p> Equip yourself with programming skills through in-depth videos of different programming areas. </p>
            <div className={styles.a}><Link href='/tutorials'> Tutorials ( soon ) </Link></div>
          </div>
        </section>

        <section className={styles.route}>
          <div className={styles.svg}>{ user?.role === 'admin' ? ShuffleSvg() : Blogsvg() }</div>
          <div>
            <h2>{ user?.role === 'admin' ? 'Analytics' : 'Blogs' }</h2>
            <p>{ user?.role === 'admin' ? 'Get analysis or all user ativities, cost and gains from our analytics page.' : 'Read release notes for neew changes and upgrades to the coden infrastructure.' }</p>
            <div className={styles.a}><Link href={ user?.role === 'admin' ? '/analytics' : '/blogs' }> { user?.role === 'admin' ? 'Analytics' : 'Blogs' } → </Link></div>
          </div>
        </section>
        </>}

        <section className={`${styles.route} ${styles['route-tips']}`}>
          <h2>Quick Navigation Tips</h2>
          <li>Utilize { user ? 'side-nav' : 'nav links' } for quick routing by <strong>hovering over it</strong> ( on big and medium screens ) or by <strong>clicking the toggle menu button</strong> at the top. </li>
          { user && <li> Some features are available on side-nav such as <strong>Chatting</strong> and <strong>Contacts</strong> to aid convenience. </li> }
          <li> Follow <strong>footer links</strong> to access relevant help or portfolio pages. </li>
          <li> Use <strong> quick links</strong> at the top of pages to access similar pages to the one you are in. </li>
          <li> Some routes are restricted to <strong>authenticated users and guests.</strong> Sign in or out respectively to access such pages </li>
        </section>

        <section className={`${styles.route} ${styles['route-tips']}`}>
          <h2 className='flex gap-3 items-center text-[#2d27a5]'> { mode === 'light' ? Sunsvg() : Nightsvg() } Themes </h2>
          <p className={styles.themeTalk}> Current Theme: <span>{FirstCase( animativeMode )}</span> </p>

          <p className={styles.themeTalk}> Available themes: 
            <span>Light</span>
            <span>Dark</span>
            <span>Portfolio ( dedicated ) </span>
          </p>
        </section>

      </section>
    </div>
  )
}