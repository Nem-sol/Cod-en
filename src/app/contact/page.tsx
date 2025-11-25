"use client"
import Link from 'next/link'
import Image from 'next/image'
import { Message } from '@/types'
import styles from './page.module.css'
import style from './../main.module.css'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { FirstCase, RemoveLikeClass, Toggle } from '@/src/components/functions'
import { useSocket } from '@/src/context/SocketContext'
import { useUserContext } from '@/src/context/UserProvider'
import { useContact } from '@/src/context/MessageContext'
import ChatInput, { PasswordInput } from '@/src/components/ChatBox'
import { Defaultbg, NewDropSets, NewFilterSets , Notify } from '@/src/components/pageParts'
import { AddSvg, Bugsvg, cancelSvg, checkmarkSvg, FolderSvg, Helpsvg, Inboxsvg, Leftsvg, loaderCircleSvg, Refreshsvg, Searchsvg, SupportSvg } from '@/src/components/svgPack'

const Contact = () => {
  const { socket , ready } = useSocket()
  const { userDetails: user} = useUserContext()

  function ContactForm(){
    const [ msg, setMsg ] = useState('')
    const [ error, setError ] = useState('')
    const [ type, setType ] = useState('Message')
    const { userDetails: user } = useUserContext()
    const [ success, setSuccess ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ name, setName ] = useState( user ? user.name : '')
    const [ email, setEmail ] = useState( user ? user.email : '')
    const handleSubmit = async (e: React.FormEvent) =>{
      setError('')
      e.preventDefault()
      if (!user && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) setError('Please enter a valid email address')
      else if (!user && !name.trim()) setError('User name required')
      else if (!msg.trim()) setError('A message content is required')
      else if (user) {
        if (!ready) setError('Unstable internet connection. Try again later')
        else {
          setLoading(true)
          socket.emit('send-contact', { msg , name: user?.name , email: user?.email , type })
        }
      } else {
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

          const result = await res.json()

          if (!res.ok) setError( result.error || `Could not send ${type.toLocaleLowerCase()}`)
          else {
            setSuccess(true)
            setError(`${FirstCase(type)} ${type !== 'message' && 'message'} sent successfully. Cod-en will reach out to you shortly.`)
            setTimeout(()=>{ setSuccess(false) ; setError('') ; setMsg('') }, 3000)
          }
        } catch (err: unknown | { message: string } ) {
          if ( err instanceof Error ) setError( String( err?.message || err || 'Something went wrong' ))
        } finally {
          setLoading(false)
        }
      }
    }

    useEffect(()=> {
      if (!user) return
      socket.on("contact-error", (error: { message: string})=> setError( error?.message || `Could not send ${type.toLocaleLowerCase()}`))
      socket.on("contact-success", ()=>{
        setSuccess(true)
        setError(`${FirstCase(type)} ${type !== 'message' && 'message'} sent successfully. Cod-en will reach out to you shortly.`)
        setTimeout(()=>{ setSuccess(false) ; setError('') ; setMsg('') }, 3000)
        return () => {
          if (!socket) return
          socket.off("contact-error")
          socket.off("contact-success")
        }
      })
    }, [ ready ])

    return(
      <main className='gap-7 flex flex-col justify-center items-center'>
        <div className={styles.background}></div>
        <form className={styles.formHolder}>
          <h2>Contact form</h2>
          <div className={styles.img}>
            <Image src='/homehero.png' fill={true} alt='contact_img' />
          </div>
          <section className={styles.form}>
            <input name='name' value={name} type="text" autoComplete='true' autoCorrect='true' placeholder={user ? user.name : 'John Michael'} onChange={(e)=> !user ? setName(e.target.value) : setName(user.name)} onKeyDown={()=> user && setName(user.name)}/>
            <input name='email' value={email} type="text" autoComplete='true' autoCorrect='true' placeholder={user ? user.email : 'you@example.com'} onChange={(e)=> !user ? setEmail(e.target.value) : setEmail(user.email)} onKeyDown={()=> user && setEmail(user.email)}/>
            <textarea name='message' value={msg} autoComplete='true' autoCorrect='true' placeholder='Start your message...' onChange={(e)=> setMsg(e.target.value)}/>
            {!user && <span>Access convenient comunication when you <Link href='/signup' style={{color: 'var(--compliment)', fontWeight: '700', whiteSpace: 'nowrap'}}>sign up</Link></span>}
            {error && <p className='text-[var(--error)] font-medium' style={success ? {color: 'var(--success)'} : {}}>{error}</p>}
            <div className='flex gap-x-2.5'>
              <div className='flex-1'><NewDropSets props={{
                query: type,
                id: styles.contact,
                class: styles.inView,
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
          <h3 className={styles.h3}>
            <p><span>Or</span></p>
            <p>Reach out to us: <em></em></p>
          </h3>
        </form>
        <Footer />
      </main>
    )
  }

  function MessagePage(){
    const [ id , setId ] = useState('')
    const [ err , setErr ] = useState('')
    const [ text , setText ] = useState('')
    const [ all , sendAll ] = useState(false)
    const [ errors , setErrors ] = useState('')
    const [ filter , setFilter ] = useState('')
    const [ subject , setSubject ] = useState('')
    const [ filters , setFilters ] = useState('')
    const [ notify , setNotify ] = useState(false)
    const [ password , setPassword ] = useState('')
    const [ message , setMessages ] = useState([''])
    const [ onLoading , setOnLoading ] = useState(false)
    const { contact , isLoading , error , setRefresh , setContact } = useContact()
    const empty = message.find((i: string) => !i.trim()) ? true : false

    const handleDraft = () => {
      const draft = { text, subject, message }
      localStorage.setItem('mass-mail-draft', JSON.stringify(draft))
    }

    const handleLoad = () => {
      setErr('')
      const raw = localStorage.getItem('mass-mail-draft')
      if (!raw) return setErr("Couldn't load draft")
      const draft = JSON.parse(raw)
      setText(draft.text)
      setSubject(draft.subject)
      setMessages(draft.message)
    }

    const handleSendAll = () => {
      setErr('')
      if ( !subject.trim() ) setErr('Please fill in the subject field')
      else if ( !text.trim() ) setErr('Please put an email summary')
      else if ( empty ) setErr('No empty points allowed')
      else if ( message.length === 0 ) setErr('Mass emails must include a point')
      else if ( password.length < 6 ) setErr('Incorrect password')
      else if (!ready) setErr("Restore internet connection")
      else {
        setOnLoading(true)
        socket.emit('mail', { subject, password , summary: text , messages: message })
      }
    }

    useEffect(()=>{
      if (!socket) return
      socket.on("mailed-to-all", ()=>{
        setText('')
        sendAll(false)
        setSubject('')
        setPassword('')
        setNotify(true)
        setMessages([''])
        setOnLoading( false )
      })
      socket.on('failed-to-mail', ( errors : { message: string , id: string | null }) => {
        setId(errors.id || '')
        if ( errors.id ) setErrors(errors.message)
        else {
          setOnLoading(false)
          setErr(errors.message)
        }
      })

      socket.on('mailed-to-one', ({ contact }: { contact : Message} )=>{
        setErrors('')
        setId(contact?._id)
        setContact(( prev: Message[]) => prev.map((mes: Message) => mes._id === contact?._id ? contact : mes ))
      })
      return () => {
        socket.off('mailed-to-one')
        socket.off('mailed-to-all')
        socket.off('failed-to-mail')
      }
    }, [ socket ])

    function ContactPacks({ message }: {message: Message}) {
      const type = message.type.toLowerCase()
      const [ msg , setMsg ] = useState([''])
      const [ pass , setPass ] = useState('')
      const [ req , setReq ] = useState(false)
      const [ error , setError ] = useState('')
      const [ loading , setLoading ] = useState(false)
      const [ validate , setValidate ] = useState(false)
      const empty = msg.filter((i: string) => !i.trim()).length > 0 ? true : false

      const handleReply = () => {
        setError('')
        if (!req) setReq(true)
        else if (!validate) setValidate(true)
        else if ( pass.length < 6 ) setError('Incorrect password')
        else if ( empty ) setError('No empty replies allowed')
        else if ( msg.length === 0 ) setErr('Replies must include a point')
        else if (!ready) setError("Restore internet connection")
        else {
          setLoading(true)
          socket.emit('mail-to-one', { msg , pass , id: message._id })
        }
      }
      
      useEffect(()=>{
        if ( id !== message._id ) return
        setLoading(false)
        setError(errors)
        setId('')
      }, [ id , errors ])

      return (
        <section className={styles.pass}>
          <p className='font-[600] gap-2.5'>
            <span title={message.name} style={{ overflow: 'hidden',  whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{message.name}</span>
            <span className='flex gap-2.5 items-center font-[500]'>{
            type === 'deals' ? FolderSvg() :
            type === 'report' ? Bugsvg() :
            type === 'enquiry' ? Helpsvg() :
            type === 'feedback' ? SupportSvg() : SupportSvg()
            }
            {FirstCase(type)}</span></p>
          <p>{message.content}</p>
          { req && <section>
            {msg.map((mes: string, i: number)=> <div className={styles.input} key={i} onDoubleClick={()=> i > 0 && setMsg((prev: string[]) => [...prev.filter((m: string) => m && m !== prev[i])])}>
              <ChatInput 
                value={mes}
                maxHeight='150px'
                placeholder='New message'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setMsg((prev: string[]) =>[...prev.map((f: string, n: number)=>{ return n === i ? e.target.value : f })].filter((m: string, n: number ) => n === i || m.trim() !== ''))}
              />
              <span onClick={()=> {
                if (mes.trim() === '' || empty ) return
                const trim = msg.filter((m: string) => m.trim())
                const num = trim.indexOf(mes) || 0
                const added = [...trim , ''].map((m: string, n: number)=> n <= num ? m : n === num + 1 ? '' : trim[n - 1])
                setMsg(added)
              }}>{AddSvg()}</span>
            </div>)}
            {validate && <PasswordInput value={pass} classes={styles.password} placeholder="Confirm with password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}/>}
          </section>}
          <p className={styles.error}>{error}</p>
          <div>
            <span className={styles.button} style={{backgroundColor: 'var(--natural)'}}>{message.replies || 'No'} { message.replies > 1 ? 'replies' : 'reply'}</span>
            <button disabled={ validate && pass.length < 6 || req && empty || loading} onClick={handleReply} className={styles.button}>
              {loading && loaderCircleSvg()}{loading ? 'Sending' : 'Reply'}</button>
            {req && <button disabled={loading} onClick={()=>{ setReq(false), setValidate(false) ; setPass(''); setMsg([''])}} className={styles.button} style={{color: 'white',backgroundColor: 'var(--error)'}}>Cancel reply</button>}
          </div>
        </section>
      )
    }
    
    function Filter( filters: string, check: string = '' ){
      let result
      let filtered = contact
      const sub = check.toLocaleLowerCase()
      const filter = filters.toLocaleLowerCase()
  
      if (!contact) result = null
      else if (filter.trim() === '') filtered = contact
      else if (['report', 'message', 'deals', 'enquiry', 'feeds'].some((f) => f === filter)) filtered = filtered.filter(( mes: Message )=> mes.type.toLocaleLowerCase().includes(filter))
      else filtered = filtered.filter(( mes: Message )=> mes.content.toLocaleLowerCase().includes(filter))

      if ( sub === 'noreply' ) filtered = filtered.filter(( mes: Message )=> mes.replies === 0 )
      else if ( sub === 'reply' ) filtered = filtered.filter(( mes: Message )=> mes.replies > 0 )
      else if ( sub === 'guest' ) filtered = filtered.filter(( mes: Message )=> !mes.isUser )
      else if ( sub === 'user' ) filtered = filtered.filter(( mes: Message )=> mes.isUser )
  
      if (filtered && filtered.length > 0) result = filtered.map((mes: Message, i: number) => <ContactPacks key={i} message={mes}/>)
  
      if (contact.length < 1 && error ) return (
        <Defaultbg props={{
          styles: style,
          img: '/homehero.png',
          h2: 'Could not get contact message',
          text: 'Try restoring internet connection or refreshing the page',
        }}/>)
      else return result ? result : 
        <Defaultbg props={{
          styles: style,
          img: '/homehero.png',
          h2: `You have no ${filter.trim() !== '' || sub.trim() !== '' ? 'matching' : 'contact'} message`,
          text: 'Try restoring internet connection or refreshing the page',
        }}/>
    }

    useEffect(()=>{
      if ( !isLoading && contact.length < 1 && error ) setRefresh(true)
    }, [])

    return (
      <main id={style.main}>
        <div className={style.main}>
          <h2 className={style.title}>{} Admin contact page</h2>
          <div className={style.quick}>
            <Link href="/Contact" className={style.second}>{Inboxsvg('BIG')} Contact</Link>
            <button onClick={() => sendAll(true)}>{SupportSvg('BIG')} Send mass email</button>
          </div>
          <div id={style.searchbar}>
            <span>{Searchsvg()}</span>
            <input autoComplete='true' type="text" name="contact" placeholder='Search contacts by content' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
            <NewFilterSets props={{
              id: 'filters',
              query: filters,
              class: style.inView,
              clicked: style.clicked,
              reset: ()=>setFilters(''),
              buttons: [
                {txt: 'Reports', reset: ()=>setFilters('report'), query: 'report'},
                {txt: 'Regular', reset: ()=>setFilters('message'), query: 'message'},
                {txt: 'Business deals', reset: ()=>setFilters('deals'), query: 'deals'},
                {txt: 'Enquiry', reset: ()=>setFilters('enquiry'), query: 'enquiry'},
                {txt: 'Feedbacks', reset: ()=>setFilters('feeds'), query: 'feeds'},
              ]
            }} />
          </div>
          <div className={style.helps}>
            <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'noreply' ? '' : 'noreply' ); Toggle( e , style.clicked ); RemoveLikeClass(e, style.clicked , `.${style.helps} span`)}}>No replies</span>
            <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'reply' ? '' : 'reply' ); Toggle( e , style.clicked ); RemoveLikeClass(e, style.clicked , `.${style.helps} span`)}}>Replied</span>
            <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'user' ? '' : 'user' ); Toggle( e , style.clicked ); RemoveLikeClass(e, style.clicked , `.${style.helps} span`)}}>Users</span>
            <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'guest' ? '' : 'guest' ); Toggle( e , style.clicked ); RemoveLikeClass(e, style.clicked , `.${style.helps} span`)}}>Guests</span>
          </div>

          { notify && <Notify types="success" message='Message sent to all users' setCondition={setNotify} />}

          { isLoading && contact.length < 1 && 
          <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: 'Getting contact messages ...',
            text: 'Please be patient while we get your contact messages',
          }}/>}

          {all && <div className={styles.mask} aria-disabled={isLoading} onClick={()=>{ setText(''); setSubject(''); setPassword(''); sendAll(false); setMessages(['']) }}></div> }

          { all && <section className={styles.all}>
            <button className={styles.cancel} disabled={onLoading} onClick={()=>{ setText(''); setSubject(''); setPassword(''); sendAll(false); setMessages([''])}}>{cancelSvg()}</button>
            <div className={styles.input} style={{ width: '100%' }}>
              <p>Subject</p>
              <input type="text" name="subject" value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} placeholder=''/>
            </div>
            <div className={styles.input} style={{ width: '100%' }}>
              <p>Summary</p>
              <input type="text" name="subject" value={text} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)} placeholder=''/>
            </div>
            <section>
              {message.map((mes: string, i: number)=> <div className={styles.input} key={i} onDoubleClick={()=> i !== 0 && setMessages((prev: string[]) => [...prev.filter((m: string) => m && m !== prev[i])])}>
                <ChatInput 
                  value={mes}
                  maxHeight='150px'
                  placeholder='New message'
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setMessages((prev: string[]) =>[...prev.map((f: string, n: number)=>{ return n === i ? e.target.value : f })].filter((m: string, n: number ) => n === i || m.trim() !== ''))}
                />
                <span onClick={()=> {
                  if (mes.trim() === '' || empty ) return
                  const trim = message.filter((m: string) => m.trim())
                  const num = trim.indexOf(mes) || 0
                  const added = [...trim , ''].map((m: string, n: number)=> n <= num ? m : n === num + 1 ? '' : trim[n - 1])
                  setMessages(added)
                }}>{AddSvg()}</span>
              </div>)}
            </section>
            <PasswordInput value={password} classes={styles.password} placeholder="Confirm with password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
            <p className={styles.error}>{err}</p>
            <div className='flex flex-wrap gap-2.5'>
              <button className={styles.button} onClick={handleSendAll}> { onLoading && loaderCircleSvg(styles.loader)} { onLoading ? 'Sending ...' : 'Send' } { !onLoading && Leftsvg()}</button>
              <button className={styles.button} onClick={handleLoad}>Load</button>
              <button className={styles.button} onClick={handleDraft}>Draft</button>
            </div>
          </section>}

          {(!isLoading || contact.length > 0) && Filter( filters, filter )}

          {error && <button disabled={isLoading} className={style.floater} onClick={()=>setRefresh(( prev: boolean )=> !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
        </div>
        <Footer />
      </main>
    )
  }
  if ( user?.role === 'admin' ) return <MessagePage />
  else return <ContactForm />
}

export default Contact
