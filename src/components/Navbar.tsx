'use client'
import Link from 'next/link'
import Image from 'next/image'
import { NewDropSets } from './pageParts'
import styles from '../app/main.module.css'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useUserContext } from '../context/UserProvider'
import { useInboxContext } from '../context/InboxContext'
import { useNotificationContext } from '../context/NotificationContext'
import { classRemove, classAdd, classToggle, FirstCase } from './functions'
import { cancelSvg, dblRightArrowsvg, FolderSvg, Helpsvg, HomeSvg, Inboxsvg, Bugsvg, Linksvg, loaderCircleSvg, NotificationSvg, ProjectSvg, Leftsvg, SettingSvg, SupportSvg, TagSvg } from './svgPack'

const NavLinks = ({props}: any) => {
  return props.arr.map(( l: any , i: number )=>(
    <Link href={l.link} key={i}>{l.svg}{l.tag}</Link>
  ))
}

export const Defaultbg = ({props}: any) => {
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
  const { ready } = useSocket()
  const [ id , setId ] = useState('')
  const [ mss, setMss ] = useState('')
  const [ msg , setMsg ] = useState('')
  const [ error , setError ] = useState('')
  const { unread } = useNotificationContext()
  const [ type, setType ] = useState('custom')
  const { userDetails : user } = useUserContext()
  const [ loading , setLoading ] = useState(false)
  const { inbox , sendMessage } = useInboxContext()
  const [ viewInbox , setViewInbox]: any = useState(null)
  const [ activeInbox , setActiveInbox]: any = useState([])
  const [ name, setName ] = useState( user ? user.name : '')
  const [ email, setEmail ] = useState( user ? user.email : '')

  const handleSendMessage = () => {
    if ( !msg.trim() ) return
    setLoading(true)
    ready ? sendMessage( id , msg ) : setError('Internet connection lost.')
    ready && setMsg('')
    setLoading(false)
  }

  useEffect(()=>{
    setActiveInbox(inbox.filter(( inb: any) => inb.status === 'active'))
    setId(activeInbox.length > 0 ? activeInbox[0]._id : null)
    inbox.length > 0 && setViewInbox(inbox.filter(( inb: any) => inb._id === id)[0] || null)
  }, [ inbox ])
  if (user) return  (
    <nav>
      <div className="mask" onClick={()=>{classRemove('nav', 'inView');classRemove('nav', 'inb')}}></div>
      <section className='pagenav'>
        <div className="holdr">
          <div className="nav">
            <h2 className="bar whitespace-nowrap text-[20px] pl-[15px!important] font-[700!important]">
              <span className='flex-1'>Quick Links</span>
              <button onClick={()=> classAdd('nav', 'inb')}>{Inboxsvg('isBig')}</button>
              <button onClick={()=> classAdd('nav', 'msg')}>{SupportSvg('isBig')}</button>
              <button onClick={()=> classRemove('nav', 'inView')}>{cancelSvg('p-1')}</button></h2>
              <NavLinks props={{ arr: []}}/>
          </div>
          <div className="inbox">
            <div style={{paddingInline: '10px'}} className='bar'>
              <button onClick={()=>classRemove('nav', 'inb')}>{dblRightArrowsvg()}</button>
              <button onClick={()=>classToggle('nav .hidden','inView')}>{ProjectSvg()}
                {inbox.length > 0 && <section className="hidden">
                  {inbox.map(( inb: any, i: number )=>(
                    <span key={i} onClick={()=>setId(inb._id)}>{inb.title}</span>
                  ))}
                </section>}
              </button>
              <button onClick={()=> classAdd('nav', 'msg')}>{SupportSvg('isBig')}</button>
              <Link href='/inbox'>{Linksvg()}</Link>
            </div>
            <section className='section'>
              {viewInbox ? (viewInbox.messages && viewInbox.messages.length > 0) ? viewInbox.messages.map(( mes: any )=> (
                <section>
                  <span>{`${String(mes.content)}`}</span>
                  <div>{mes.updatedAt}</div>
                </section>
              )) : <Defaultbg props={{
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
              <p className='text-[var(--error)] text-end font-medium px-2.5 self-end mt-auto'>{error}</p>
            </section>
            {viewInbox && <div className="input mx-2.5 bar">
              <input type="text" placeholder='' value={msg} onChange={ e => setMsg(e.target.value)}/>
              <button disabled={loading} className='bg-[var(--success)!important] text-[white!important]' onClick={()=> msg.trim() !== '' && handleSendMessage()}>{ loading ? loaderCircleSvg() : Leftsvg('BIG')}</button>
            </div>}
          </div>
          <div className="contact">
            <h2 className="bar whitespace-nowrap text-[20px] pl-[15px!important] font-[700!important]">
              <span className='flex-1'>{type === 'custom' ? 'Contact' : type === 'deals' ? 'Business deals' : FirstCase(type)} </span>
              <button onClick={()=> classRemove('nav', 'msg')}>{dblRightArrowsvg()}</button>
              <button onClick={()=> {classAdd('nav', 'inb'); classRemove('nav', 'msg')}}>{Inboxsvg('isBig')}</button>
              <Link href='/contact'>{Linksvg()}</Link>
            </h2>
            <div className="holder">
              <input name='name' value={name} type="text" autoComplete='true' autoCorrect='true' placeholder={user.name} onChange={()=> setName(user.name)} onKeyDown={()=> setName(user.name)}/>
              <input name='email' value={email} type="text" autoComplete='true' autoCorrect='true' placeholder={user.email} onChange={()=> setEmail(user.email)} onKeyDown={()=> setEmail(user.email)}/>
              <textarea name='message' value={mss} autoComplete='true' autoCorrect='true' placeholder='Start your message...' onChange={(e)=> setMss(e.target.value)}/>
              <div className='flex gap-x-2.5 items-center'>
                <div className='flex-1 h-10'><NewDropSets props={{
                  query: type,
                  id: 'contact',
                  class: 'inView',
                  buttons: user ? [
                    {svg: Helpsvg(), txt: 'Enquiry', query: 'enquiry', func: ()=>setType('enquiry')},
                    {svg: FolderSvg(), txt: 'Deals', query: 'deals', func: ()=>setType('deals')},
                    {svg: SupportSvg('isBig'), txt: 'Custom', query: 'custom', func: ()=>setType('custom')},
                    {svg: Bugsvg(), txt: 'Report', query: 'report', func: ()=>setType('report')},
                    {svg: SupportSvg('isBig'), txt: 'Feedback', query: 'feeds', func: ()=>setType('feeds')}
                  ] : [
                    {svg: Helpsvg(), txt: 'Enquiry', query: 'enquiry', func: ()=>setType('enquiry')},
                    {svg: FolderSvg(), txt: 'Business deals', query: 'deals', func: ()=>setType('deals')},
                    {svg: SupportSvg('BIG'), txt: 'Custom', query: 'custom', func: ()=>setType('custom')}
                  ]
                }}/></div>
                <button className='button'>Send {Leftsvg('big')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="links" onMouseEnter={()=> window.innerWidth > 650 && classAdd('nav', 'inView')}>
        <Link href='/dashboard'>{HomeSvg()}</Link>
        <Link href='/projects'>{ProjectSvg()}</Link>
        <Link href='/notifications'>{NotificationSvg()}{unread > 0 && <span className='bg-[var(--error)] rounded-full aspect-square min-w-5.5 min-h-5.5 text-[15px] flex items-center justify-center text-white -top-[5px] -right-[3px]' style={{position: 'absolute', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 2px 3px rgba(0, 0, 0, 0.2)'}}>{unread > 9 ? '9' : unread}</span>}</Link>
        <Link href='/tutorials'>{TagSvg('BIG hover:rotate-90')}</Link>
        <Link href='/settings'>{SettingSvg('hover:rotate-90')}</Link>
        <Link href='/help'>{Helpsvg('hover:scale-[1.25]')}</Link>
      </section>
    </nav>
  )
}
