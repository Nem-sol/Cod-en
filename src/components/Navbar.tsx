'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Inboxes, Msg } from '@/types'
import styles from '../app/main.module.css'
import { format, isSameDay } from 'date-fns'
import ChatInput from '../components/ChatBox'
import style from '../app/inbox/page.module.css'
import { Copier, NewDropSets } from './pageParts'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useUserContext } from '../context/UserProvider'
import { useInboxContext } from '../context/InboxContext'
import { useNotificationContext } from '../context/NotificationContext'
import { classRemove, classAdd, classToggle, FirstCase, pick } from './functions'
import { cancelSvg, dblRightArrowsvg, FolderSvg, Helpsvg, HomeSvg, Inboxsvg, Bugsvg, Linksvg, loaderCircleSvg, NotificationSvg, ProjectSvg, Leftsvg, SettingSvg, SupportSvg, TagSvg, checkmarkSvg, HistorySvg, AddProjectsvg, Blogsvg, Locationsvg, Githubsvg, Facebooksvg, AppSvg, Packssvg, Padlocksvg, dblChecksvg } from './svgPack'

type link = {
  func: void | null
  tag: string | null
  link: string | null
  svg: React.ReactNode | null
}

type prop = {
  props: {
    arr: link[] | []
  }
}

type bg = {
  props: {
    h2: string
    img: string
    text: string
    styles: {readonly [key: string]: string}
  }
}

const NavLinks = ({props}: prop) => {
  return props.arr.map(( l: link , i: number )=>(
    l.func ? <button key={i} onClick={l.func}>{l.svg}{l.tag}</button> : <Link href={l.link || window.location.pathname} key={i}>{l.svg}{l.tag}</Link>
  ))
}

export const Defaultbg = ({props}: bg) => {
  return (
    <div className={props.styles.default_bg + ' place-self-center'}>
      <h2 className='w-full font-bold text-[21px] text-center pt-8'>{props.h2}</h2>
      <div className={props.styles.img}>
        <Image src={props.img ? props.img : '/homehero.png'} fill={true} alt='page-not-found' />
      </div>
      <p className='w-full text-center max-w-80 flex-wrap font-medium text-[16px]'>
        {props.text}
      </p>
    </div>
  )
}
export default function Navbar() {
  const [ id , setId ] = useState('')
  const [ mss, setMss ] = useState('')
  const [ msg , setMsg ] = useState('')
  const [ err , setErr ] = useState('')
  const [ error , setError ] = useState('')
  const { unread } = useNotificationContext()
  const [ type, setType ] = useState('message')
  const { userDetails : user } = useUserContext()
  const [ sucess , setSuccess ] = useState(false)
  const { ready , setRetry , socket } = useSocket()
  const [ isLoading , setIsLoading ] = useState(false)
  const [ name, setName ] = useState( user?.name || '')
  const [ email, setEmail ] = useState( user?.email || '')
  const { inbox , sendMessage , readMessages , loading , err: errors , unread: notread } = useInboxContext()
  const viewInbox = inbox.filter(( inb: Inboxes) => inb._id === id)[0] || null
  const activeInbox = inbox.filter(( inb: Inboxes) => inb.status === 'active')

  const handleSendMessage = () => {
    if ( !msg.trim() ) return
    ready ? sendMessage( id , msg ) : setErr('Internet connection lost.')
    if (!ready ) setRetry(true)
  }

  const handleSendContact = async (e: React.FormEvent) =>{
      setError('')
      e.preventDefault()
      if (!mss.trim()) setError('A message content is required')
      else if (!ready) setError('Unstable internet connection. Try again later')
      else {
        setIsLoading(true)
        socket?.emit('send-contact', { msg: mss , name: user?.name , email: user?.email , type })
      }
    }

  useEffect(()=>{
    setId(activeInbox.length > 0 ? activeInbox[0]._id : '')
  }, [ inbox ])

  useEffect(()=>{
    if ( notread && pick('nav.inb') && id ) readMessages(id)
  })

  useEffect(()=> {
    if (!user) return
    socket?.on("contact-error", (error: {message: string}) => {
      setIsLoading(false)
      setError( error?.message || `Could not send ${type.toLocaleLowerCase()}`)
    })
    socket?.on("contact-success", ()=>{
      setSuccess(true)
      setIsLoading(false)
      setError(`${FirstCase(type)} ${type !== 'message' && 'message' } sent successfully. Cod-en will reach out to you shortly.`)
      setTimeout(()=>{ setSuccess(false) ; setError('') ; setMsg('') }, 3000)
    })
    return () => {
      if (!socket) return
      socket?.off("contact-error")
      socket?.off("contact-success")
    }
  }, [ ready ])

  if (user) return  (
    <nav>
      <div className="mask" onClick={()=>{classRemove('nav', 'inView');classRemove('nav', 'inb')}}></div>
      <section className='pagenav'>
        <div className="holdr">
          <div className="nav">
            <h2 className="bar whitespace-nowrap pl-[15px!important] font-[700!important]">
              <span className='flex-1'>Quick Links</span>
              <button onClick={()=> classAdd('nav', 'inb')}>{Inboxsvg('isBig')}</button>
              <button onClick={()=> classAdd('nav', 'msg')}>{SupportSvg('isBig')}</button>
              <button onClick={()=> classRemove('nav', 'inView')}>{cancelSvg('p-1')}</button></h2>
              <NavLinks props={{ arr: [
                {tag: 'New Project', link: '/projects/new', svg: AddProjectsvg(), func: null},
                {tag: 'History', link: '/history', svg: HistorySvg(), func: null},
                {tag: 'Routing', link: '/help/routing', svg: Locationsvg(), func: null},
                {tag: 'Contact', link: '/contact', svg: SupportSvg(), func: null},
                {tag: 'Inbox', link: '/inbox', svg: Inboxsvg('isBig'), func: null},
                {tag: 'Blogs', link: '/blogs', svg: Blogsvg(), func: null},
                {tag: 'Help', link: '/help', svg: Helpsvg(), func: null},
                {tag: 'Account recovery', link: '/recovery', svg: Padlocksvg('pb-0.5'), func: null},
                {tag: 'Make payments', link: '/payments', svg: Packssvg('BIG'), func: null},
                {tag: 'Cod-en projects', link: '/portfolio/projects', svg: AppSvg(), func: null},
                {tag: 'Follow us', link: '/portfolio/socials', svg: <>{Githubsvg('BIG')}{Facebooksvg()}</>, func: null},
              ]}}/>
          </div>
          <div className="inbox">
            <div style={{paddingInline: '10px'}} className='bar'>
              <button onClick={()=>classRemove('nav', 'inb')}>{dblRightArrowsvg()}</button>
              <button onClick={()=>classToggle('nav .hidden','inView')}>{ProjectSvg()}
                {inbox.length > 0 && <section className="hidden">
                  {inbox.map(( inb: Inboxes, i: number )=>(
                    <span key={i} onClick={()=>setId(inb._id)}>{inb.title}</span>
                  ))}
                </section>}
              </button>
              <button onClick={()=> classAdd('nav', 'msg')}>{SupportSvg('isBig')}</button>
              <Link href='/inbox'>{Linksvg()}</Link>
            </div>
            <section className='section'>
              {viewInbox ? (viewInbox.messages && viewInbox.messages.length > 0) ? viewInbox.messages.map(( mes: Msg , i: number) => {
              const next = viewInbox.messages[i + 1]
              const isOwner = user.id === viewInbox.userId
              const isToday = !next || isSameDay(new Date(next.createdAt) , new Date(mes?.createdAt))
              return <>
                <section key={i} className={`${ isOwner ? !mes.sent ? style.received : style.sent : mes.sent ? style.received : style.sent}`}>
                  <div className={`${(!next || next.sent !== mes.sent || !isToday) ? style.last : ''}`}><span>{mes.content}</span></div>
                  <p>{format(mes.updatedAt, 'h:mm a')} <Copier props={{text: mes?.content}}/> { isOwner ? (mes.sent ?
                  mes.read ? dblChecksvg('text-blue-500') : checkmarkSvg() : <></> ) :
                  !mes.sent ?
                  mes.read ? dblChecksvg('text-blue-500') : checkmarkSvg() : <></> }</p>
                </section>
                {!isToday && <menu className={style.date}>{format(next?.createdAt, 'do, MMMM, yy')}</menu>}
              </>
              }) : <Defaultbg props={{
                styles: styles,
                img: '/homehero.png',
                h2: 'You have no messages',
                text: 'Send a message and begin conversation. Messages deemed unimportant may be ignored',
              }}/> : <Defaultbg props={{
                styles: styles,
                img: '/homehero.png',
                h2: 'You have no inbox',
                text: 'Create an active project to view inbox or switch inbox from toolbar.',
              }}/>}
            </section>
            <p className='text-[var(--error)] text-end font-medium px-2.5 self-end'>{ errors || err }</p>
            {viewInbox && viewInbox.status === 'active' && <div className="input mx-1 bar">
              <ChatInput value={msg} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMsg(e.target.value)}/>
              <button disabled={loading} className='bg-[var(--success)!important] text-[white!important]' onClick={()=> msg.trim() !== '' && handleSendMessage()}>{ loading ? loaderCircleSvg() : Leftsvg('p-1')}</button>
            </div>}
          </div>
          <div className="contact">
            <h2 className="bar whitespace-nowrap pl-[15px!important] font-[700!important]">
              <span className='flex-1'>{type === 'message' ? 'Contact' : type === 'deals' ? 'Business deals' : FirstCase(type)} </span>
              <button onClick={()=> classRemove('nav', 'msg')}>{dblRightArrowsvg()}</button>
              <button onClick={()=> {classAdd('nav', 'inb'); classRemove('nav', 'msg')}}>{Inboxsvg('isBig')}</button>
              <Link href='/contact'>{Linksvg()}</Link>
            </h2>
            <div className="holder">
              <input name='name' value={name} type="text" autoComplete='true' autoCorrect='true' placeholder={user?.name || 'John Michael'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(user?.name || e.target.value)} onKeyDown={()=> setName((prev: string) => user?.name || prev )}/>
              <input name='email' value={email} type="text" autoComplete='true' autoCorrect='true' placeholder={user?.email || 'you@example.com'} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>  setEmail(user?.email || e.target.value)} onKeyDown={()=> setEmail((prev)=> user?.email || prev)}/>
              <textarea name='message' value={mss} autoComplete='true' autoCorrect='true' placeholder='Start your message...' onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setMss(e.target.value)}/>
              <p className='text-[var(--error)] text-end font-medium px-2.5 self-end mt-auto' style={sucess ? {color: 'var(--success)'} : {}}>{error}</p>
              <div className='flex gap-x-2.5 items-center'>
                <div className='flex-1 h-10'><NewDropSets props={{
                  query: type,
                  id: 'contact',
                  class: 'inView',
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
                <button className='button' disabled={isLoading} onClick={handleSendContact}>{sucess ? 'Sent' : !isLoading ? 'Send' : 'Sending...'} {sucess ? checkmarkSvg(sucess ? 'min-w-6 opacity-[1!important] inset-auto' : '') : !isLoading ? Leftsvg('big') : loaderCircleSvg(isLoading ? 'min-w-6 opacity-[1!important] inset-auto' : '')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="links" onMouseEnter={()=> window.innerWidth > 650 && classAdd('nav', 'inView')}>
        <Link href='/dashboard'>{HomeSvg()}</Link>
        <Link href='/projects' className='group'>{ProjectSvg('group-hover:-rotate-15')}</Link>
        <Link href='/notifications' className='group'>{NotificationSvg('top-0 group-hover:-top-1')}{unread > 0 && <span className='bg-[var(--error)] rounded-full aspect-square min-w-5.5 text-[15px] flex items-center justify-center text-white -top-[5px] -right-[3px]' style={{position: 'absolute', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 2px 3px rgba(0, 0, 0, 0.2)'}}>{unread > 9 ? '9' : unread}</span>}
        </Link>
        <Link href='/tutorials' className='group'>{TagSvg('BIG group-hover:rotate-90')}</Link>
        <Link href='/settings' className='group'>{SettingSvg('group-hover:rotate-90')}</Link>
        <Link href='/help' className='group'>{Helpsvg('group-hover:scale-[1.25]')}</Link>
      </section>
    </nav>
  )
}
