'use client'
import Link from 'next/link'
import Image from 'next/image'
import validator from 'validator'
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../context/ThemeContext'
import { useContext, useEffect, useState } from 'react'
import { useUserContext } from '../context/UserProvider';
import { CheckIncludes, classAdd, classRemove, classToggle, FirstCase, pick, pickAll, RemoveLikeClass, RemoveOtherClass, scrollCheck } from './functions'
import { Backsvg, Blogsvg, cancelSvg, Bugsvg, Csssvg, FolderSvg, Helpsvg, Inboxsvg, Javascriptsvg, Leftsvg, LogInSvg, LogoutSvg, Mailsvg, Nextsvg, Nightsvg, Nodesvg, ProjectSvg, Pythonsvg, Reactsvg, Rocketsvg, Rustsvg, SettingSvg, Sunsvg, SupportSvg, TagSvg, loaderCircleSvg, TypeScriptsvg, Copysvg, checkmarkSvg } from './svgPack'


export function Back(){
  const router = useRouter()
  return(
    <button onClick={()=>router.back()}>{Backsvg()}<span>Back</span></button>
  )
}

export const HomeLink = ({children}) => {
  const { userDetails: user } = useUserContext()
  return <Link href={user ? '/dashboard' : '/'}>{children}</Link>
}

export const year = new Date().getFullYear()
const ThemeToggle = () => {
  const { toggle , mode } = useContext(ThemeContext)
  return(
    <div id='theme' onClick={toggle}>
      <button>{Sunsvg()}</button>
      <button>{Nightsvg()}</button>
      <button className="identifier" style={{left: mode === 'light' ? '2.5px': 'calc(100% - 34px)'}}></button>
    </div>
  )
}

export function UserNav(){
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
      <button className='button' onClick={()=>{classAdd('nav', 'inView'), classAdd('nav', 'inb')}}>{Inboxsvg('isBig')} Inbox</button>
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
      <Link href='/portfolio'>{ProjectSvg()} Portfolio</Link>
      <Link href='/help/services'>{TagSvg('isBig')} Services</Link>
      <Link href='/contact'>{SupportSvg('isBig')} Contact</Link>
    </div>
  )
}

export function DropButton({props}) {
  const { userDetails: user } = useUserContext()
  return (
    <button onClick={()=>{
        if (!user){
          classToggle('.link_pack', 'inView');
          window.addEventListener('click', (e)=>{
            !CheckIncludes(e, '.link_pack') && !CheckIncludes(e, 'header div button:first-child') && classRemove('.link_pack', 'inView')
          })
        } else classToggle('nav', 'inView')
      }}>
      {props.text}
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
    fontWeight: 600,
    fontSize: '15px',
    position: 'fixed',
    padding: '10px 15px',
    borderRadius: '25px',
    pointerEvents: 'none',
    borderBottomRightRadius: '5px',
    animation: `notify 1 ${time}ms linear forwards`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)',
    color: types === 'error' ? 'var(--error)' : types === 'success' ? 'var(--success)' : '#a6aa69',
    borderColor: types === 'error' ? 'var(--error)' : types === 'success' ? 'var(--success)' : '#a6aa69',
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
    <menu id={props.id} className={props.cln ? props.cln : ''} onClick={()=>{classToggle(`#${props.id}`, `${props.class}`); RemoveOtherClass(`#${props.id}`, `${props.class}`, 'menu')}}>
      <span>
        { active.length > 0 ?  <> {active[0].svg} {active[0].txt} </> : <>{SupportSvg('BIG')} Message</>}</span>
      <div>
        {props.buttons.map(( btn , i )=> <span key={i} onClick={btn.func}> {btn.svg} {btn.txt} </span>
        )}
      </div>
    </menu>
  )
}

export function DropUserButton() {
  const { userDetails: user } = useUserContext()
  return (
    <button style={{height: '34px', width: '44px', backgroundColor: 'var(--sweetPurple)'}} onClick={()=>{classToggle('.user_pack', 'inView'); window.addEventListener('click', (e)=>{!CheckIncludes(e, '.user_pack') && !CheckIncludes(e, '.user_pack button') && !CheckIncludes(e, 'header div button:last-child') && classRemove('.user_pack', 'inView')})}}>
      <span className="pointer-events-none">{user ? user.name[0].toLocaleUpperCase() : 'G'}</span>
    </button>
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
  })
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

export function ContactForm({props}){
  const [ msg, setMsg ] = useState('')
  const [ error, setError ] = useState('')
  const [ type, setType ] = useState('Message')
  const { userDetails: user } = useUserContext()
  const [ success, setSuccess ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ name, setName ] = useState( user ? user.name : '')
  const [ email, setEmail ] = useState( user ? user.email : '')
  const handleSubmit = async (e) =>{
    setError('')
    e.preventDefault()
    if (!user && !validator.isEmail(email)){
      setError('Please enter a valid email address')
      return
    }
    if (!user && !name.trim()) setError('User name required')
    if (!msg.trim()) {
      setError('A message content is required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg , name: user ? user.name : name , email: user ? user.email : email , type })
      });

      const contentType = res.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setError('Unexpected server error. Try again later')
        return
      }

      if (!res.ok) setError(res.json().error || `Could not send ${type.toLocaleLowerCase()}`)
      else {
        setSuccess(true)
        setError(`${FirstCase(type)} ${type !== 'message' && message} sent successfully. Cod-en will reach out to you shortly.`)
        setTimeout(()=>{ setSuccess(false) ; setError('') ; setMsg('') }, 3000)
      }
    } catch (err) {
      setError(err || 'Something went wrong')
    }
    setLoading(false)
  }
  return(
    <section className={props.form}>
      <input name='name' value={name} type="text" autoComplete='true' autoCorrect='true' placeholder={user ? user.name : 'John Michael'} onChange={(e)=> !user ? setName(e.target.value) : setName(user.name)} onKeyDown={()=> user && setName(user.name)}/>
      <input name='email' value={email} type="text" autoComplete='true' autoCorrect='true' placeholder={user ? user.email : 'you@example.com'} onChange={(e)=> !user ? setEmail(e.target.value) : setEmail(user.email)} onKeyDown={()=> user && setEmail(user.email)}/>
      <textarea name='message' value={msg} autoComplete='true' autoCorrect='true' placeholder='Start your message...' onChange={(e)=> setMsg(e.target.value)}/>
      {!user && <span>Access convenient comunication when you <Link href='/signup' style={{color: 'var(--compliment)', fontWeight: '700', whiteSpace: 'nowrap'}}>sign up</Link></span>}
      {error && <p className='text-[var(--error)] font-medium' style={success ? {color: 'var(--success)'} : {}}>{error}</p>}
      <div className='flex gap-x-2.5'>
        <div className='flex-1'><NewDropSets props={{
          query: type,
          id: props.contact,
          class: props.inView,
          buttons: user ? [
              {svg: Helpsvg(), txt: 'Enquiry', query: 'enquiry', func: ()=>setType('enquiry')},
              {svg: FolderSvg(), txt: 'Deals', query: 'deals', func: ()=>setType('deals')},
              {svg: SupportSvg('isBig'), txt: 'Message', query: 'message', func: ()=>setType('message')},
              {svg: Bugsvg(), txt: 'Report', query: 'report', func: ()=>setType('report')},
              {svg: SupportSvg('isBig'), txt: 'Feedback', query: 'feeds', func: ()=>setType('feeds')}
            ] : [
            {svg: Helpsvg(), txt: 'Enquiry', query: 'enquiry', func: ()=>setType('enquiry')},
            {svg: FolderSvg(), txt: 'Business deals', query: 'deals', func: ()=>setType('deals')},
            {svg: SupportSvg('BIG'), txt: 'Message', query: 'message', func: ()=>setType('message')}
          ]
        }}/></div>
        <button disabled={loading} onClick={handleSubmit}>{success ? 'Sent' : !loading ? 'Send' : 'Sending...'} {success ? checkmarkSvg(success ? 'min-w-6 opacity-[1!important] inset-auto' : '') : !loading ? Leftsvg('big') : loaderCircleSvg(loading ? 'min-w-6 opacity-[1!important] inset-auto' : '')}</button>
      </div>
    </section>
  )
}