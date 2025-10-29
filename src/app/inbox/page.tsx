'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import style from './page.module.css'
import React, { useState } from 'react'
import styles from './../main.module.css'
import Footer from '@/src/components/Footer'
import ChatInput from '@/src/components/ChatBox'
import { Defaultbg } from '@/src/components/pageParts'
import { useSocket } from '@/src/context/SocketContext'
import { useUserContext } from '@/src/context/UserProvider'
import { useInboxContext } from '@/src/context/InboxContext'
import { Backsvg, HistorySvg, Inboxsvg, loaderCircleSvg, Moresvg, ProjectSvg, Rocketsvg, Searchsvg, SupportSvg } from '@/src/components/svgPack'
import { classRemove, classToggle, FirstCase } from '@/src/components/functions'

type Msg = {
  _id: string
  sent: boolean
  read: boolean
  content: string
  createdAt: string
  updatedAt: string
}

type Inboxes = {
  _id: string
  title: string
  status: string
  userId: string
  messages: Msg[]
  createdAt: string
  updatedAt: string
  projectId: string
  receiverId: string
}

type InboxPacks = {
  inb: Inboxes[]
}

const Inbox = () => {
  const { ready } = useSocket()
  const [ id , setId ] = useState('')
  const [ filters, setFilters ] = useState('')
  const { inbox , error, setRefresh, isLoading, sendMessage } = useInboxContext()

  const active = inbox.length > 0 ? inbox.filter(( inb: Inboxes) => inb._id === id)[0] || null : null

  function InboxPack({inb}: InboxPacks){
    const [ msg , setMsg ] = useState('')
    const [ error , setError ] = useState('')
    const { userDetails: user } = useUserContext()
    const [ loading , setLoading ] = useState(false)

    const handleSendMessage = async () => {
      if (msg.trim() === '') return
      setLoading(true)
      if (ready) {
        sendMessage( id , msg )
        setMsg('')
      } else setError('Internet connection lost.')
      setLoading(false)
    }

    return(
      <div className={style.inboxPack}>
        <div className={style.all}>
          {inb.length > 0 ? inb.map((i: Inboxes, n: number)=>(
            <section key={n} onClick={()=>{setId(i._id)}}>
              <h2>{Inboxsvg('BIG')} {i.title} {id === i._id && <span>In view</span>}</h2>
              <p style={{backgroundColor: i.status === 'active' ? 'var(--success)' : i.status === 'completed' ? 'var(--error)' : 'var(--mild-dark)'}}>{i.status}</p>
            </section>
          )) : <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: 'You have no matcing inbox',
            text: 'Try turning off filters or refreshing the page',
          }}/>}
        </div>
        <div className={style.one}>
          <div style={{paddingInline: '20px', boxShadow: '0 5px 10px var(--sweetRed)', zIndex: 1}} className={style.bar}>
            <h2 className='font-bold text-[18px] flex-1'>{active ? active.title : 'Inbox'}</h2>
            {inbox.length > 0 && <button onClick={()=>{classToggle(`.${style.hidden}`, style.inView); classRemove(`.hidden2`, style.inView)}}>{ProjectSvg()}
              <section className={style.hidden}>
                {inbox.map(( i: Inboxes, n: number )=>(
                  <span key={n} onClick={()=>setId(i._id)}>{i.title}</span>
                ))}
              </section>
            </button>}
            {id && <button onClick={()=>{classToggle('.hidden2', style.inView); classRemove(`.${style.hidden}`, style.inView)}}>
              {Moresvg()}
              <section className={`${style.hidden} hidden2`}>
                <span>{active?._id}</span>
                <span>{active?.title}</span>
                <span>{FirstCase(active?.status)}</span>
                <span>Unread - {active?.messages.filter((msg: Msg) => user.id === active.userId ? !msg.sent : msg.sent).length}</span>
                <span>{format(active!.createdAt, "do MMMM, yyyy")}</span>
              </section>
            </button>}
          </div>
          <section className={style.section}>
            {inbox.length < 1 && <Defaultbg props={{            
              styles: style,
              img: '/homehero.png',
              h2: 'You have no inbox',
              text: 'Create an active project to view inbox or switch inbox from toolbar.',
            }}/>}
            {inbox.length > 0 && !active && <Defaultbg props={{            
              styles: style,
              img: '/homehero.png',
              h2: 'No message to display',
              text: 'Select an inbox to view and update messages',
            }}/>}
            {active && active.messages && active.messages.length > 0 && active.messages.map(( mes: Msg , i: number) => (
              <section key={i} className={mes.sent ? (user.role === 'user' ? 'sent' : style.received) : (user.role !== 'user' ? style.received : 'sent')}>
                <div><span>{mes.content}</span></div>
                <p>{format(mes.updatedAt, 'h:mm a')}</p>
              </section>
            ))}
            { active && active.messages.length < 1 && <Defaultbg props={{            
              styles: style,
              img: '/homehero.png',
              h2: 'You have no messages',
              text: 'Send a message and begin conversation. Messages deemed unimportant may be ignored',
            }} />}
            <p className='text-[var(--error)] text-end font-medium px-2.5 self-end my-1'>{error}</p>
          </section>
          {active && <div className={`${style.input} ${style.bar}`}>
            <ChatInput value={msg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)}/>
            <button disabled={loading} className='bg-[var(--success)!important] text-[white!important]' onClick={()=> msg.trim() !== '' && handleSendMessage()}>{ loading ? loaderCircleSvg() : Rocketsvg('BIG')}</button>
          </div>}
        </div>
      </div>
    )
  }

  function Filter(filters: string){
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = inbox

    if (filter.trim() === '') filtered = inbox
    else filtered = filtered.filter(( inb: Inboxes )=> inb.title.toLocaleLowerCase().includes(filter))

    if (inbox && inbox.length > 0) return <InboxPack inb={filtered}/>

    else if (inbox.length < 1 && !error) return (
      <Defaultbg props={{
        styles: style,
        img: '/homehero.png',
        h2: `You have no inbox`,
        text: 'Create a project to view inbox',
      }}/>
    )

    else if (inbox && inbox.length === 0 && error ) return (
      <Defaultbg props={{
        styles: style,
        img: '/homehero.png',
        h2: 'Could not get messages',
        text: 'Try restoring internet connection or refreshing the page',
      }} />)
  }
  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{Inboxsvg()} Inbox</h2>
        <div className={styles.quick}>
          <Link href='/history' className={styles.second}>{HistorySvg()} History</Link>
          <Link href='/contact'>{SupportSvg('max-w-[22]')} Contact us</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' type="text" name="msg" placeholder='Search by inbox title' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
        </div>
        {(!isLoading || inbox.length > 0) && Filter(filters)}
        {(isLoading && inbox.length < 1) && <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: 'Getting messages...',
            text: 'Please be patient while we get your messages',
          }} />}
        {(error || isLoading) && inbox.length < 1 && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Backsvg()}</button>}
      </div>
      <Footer />
    </main>
  )
}

export default Inbox
