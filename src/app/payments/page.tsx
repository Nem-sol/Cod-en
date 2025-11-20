'use client'
import Link from 'next/link'
import style from './page.module.css'
import styles from './../main.module.css'
import { useRouter } from 'next/navigation'
import Footer from '@/src/components/Footer'
import ChatInput from '@/src/components/ChatBox'
import stylez from './../recovery/page.module.css'
import React, { useEffect, useState } from 'react'
import { useSocket } from '@/src/context/SocketContext'
import { useUserContext } from '@/src/context/UserProvider'
import { useProjectContext } from '@/src/context/ProjectContext'
import { NewDropSets, Notify } from '@/src/components/pageParts'
import { classToggle, FirstCase, pick, pickAll, revAnimationTimeline } from '@/src/components/functions'
import { Leftsvg, Rocketsvg, TagSvg, PlaySvg, Prosvg, FlutterWaveSvg, PayStackSvg, Padlocksvg, ShortPayStackSvg, Infosvg } from '@/src/components/svgPack'

const Payments = () => {
  const router = useRouter()
  const [ err , setErr ] = useState('')
  const [ req , setReq ] = useState('')
  const { socket , ready } = useSocket()
  const [ desc , setDesc ] = useState('')
  const [ rev , setRev ] = useState( false )
  const [ type , setType ] = useState('gift')
  const [ number , setNumber ] = useState('')
  const [ reason , setReason ] = useState('')
  const [ amount , setAmount ] = useState('')
  const [ method , setMethod ] = useState('')
  const [ notify , setNotify ] = useState(false)
  const [ targetId , setTargetId ] = useState('')
  const [ provider , setProvider ] = useState('')
  const [ currency , setCurrency ] = useState('NGN')
  const [ loading , setLoading ] = useState( false )
  const [ scrolling , setScrolling ] = useState( false )
  const { userDetails: user , error } = useUserContext()
  const [ name , setName ] = useState(user?.name || '' )
  const [ email , setEmail ] = useState(user?.email || '')
  const { project: projects , isLoading , error: errors } = useProjectContext()


  const handlePay = async (e: React.FormEvent) => {
    setErr('')
    e.preventDefault()
    const num = Number(amount)
    if (!email) setErr("Payer's email is required")
    else if (!amount) setErr('Payment amount is required')
    else if (num < 5 && currency === 'USD') setErr('Dollar payment is too small')
    else if (num < 5000 && currency === 'NGN') setErr('Naira payment is too small')
    else if (num < 100 && currency === 'USD') setErr('Amount is too small')
    else if (number && number.length < 11 ) setErr('Enter a valid phone number')
    else if (req !== 'pay') setReq('pay')
    else if (!user) {
      setLoading(true)
      pickAll(`.${style.form} button`).forEach(( i , n )=> {
        if (i === e.target && n === 1) { setProvider('paystack'); setType('gift')}
        else if (i === e.target && n === 2) { setProvider('flutterwave'); setType('gift')}
      })
      const description = desc || `${FirstCase(provider)} ${type} payment from ${ name || user?.name || 'Guest'}`
      const res = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({ type, email: user?.email || email, targetId, amount, desc: description, currency, provider, method, userId: user?.id })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setLoading(false)
        setErr(data.error)
      }

      window.location.href = data.link
    }
    else if (user) {
      setLoading(true)
      pickAll(`.${style.form} button`).forEach(( i , n )=> {
        if (i === e.target && n === 1) { setProvider('paystack'); setType('gift')}
        else if (i === e.target && n === 2) { setProvider('flutterwave'); setType('gift')}
      })
      const description = desc || `${FirstCase(provider)} ${type} payment from ${ name || user?.name || 'Guest'}`

      if (!ready) {
        setNotify(true)
        setReason('socket')
        return
      }
      socket.emit("gift-payments", { type, email: user?.email || email, targetId, amount:  Number(amount.trim()), desc: description, currency, provider, method, userId: user?.id });
    }
  }

  const handleRenew = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) router.push('/signin')
    else if ( error ) { setReason('internet'); setNotify(true)}
    else if (user.exclusive) { setReason('exclusive'); setNotify(true)}
    else {setReq('exclusive')}
  }

  const handlePayTutorials = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) router.push('/signin')
    else if ( error ) { setReason('internet'); setNotify(true)}
    else {setReq('tutorials')}
  }

  const handlePayProjects = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) router.push('/signin')
    else if ( isLoading ) { setReason('loading'); setNotify(true)}
    else if ( errors ) { setReason('socket'); setNotify(true)}
    else if ( !projects ) { setReason('projects'); setNotify(true)}
    else {setReq('projects')}
  }

  useEffect(()=>{
    const tog = () => pickAll(`.${style.features} section`).forEach((i) => revAnimationTimeline(i, style.inView, window.innerHeight / 1 ))
    const scroller = () => {
      let interval
      if (pick(`.${style.features} section`)?.classList.contains(style.inView)) {
        if (scrolling) return
        setScrolling(true)
        const l = pick(`.${style.left}`)
        const r = pick(`.${style.right}`)
        l.style.top = l.style.top === '20%' ? '75%' : '20%'
        r.style.top = r.style.top === '75%' ? '20%' : '75%'
        interval = setTimeout(()=>{
          l.style.left = l.style.left === '10%' ? '75%' : '10%'
          r.style.left = r.style.left === '75%' ? '10%' : '75%'
          setTimeout(()=>{ setScrolling(false); setRev( prev => !prev )} , 2000)
        }, 2000)
      } else clearInterval(interval)
    }
    tog()
    scroller()
    window.addEventListener('scroll', tog )
    const int = setInterval( scroller , 5000)
    return () => {
      clearInterval(int)
      window.removeEventListener('scroll', tog)
    }
  }, [])

  return (
    <main id={styles.main} style={{maxWidth: '100%'}}>
      <div className={style.background} ></div>
      <menu id={stylez.fill} onClick={()=>classToggle(`#${stylez.fill}`, stylez.inView)}>
        <button>{Infosvg()} Info</button>
        <section className={stylez.autoFill}>
          <span><svg></svg> Payee's name and email should be of the account owner from which money is to be sent</span>
          <span><svg></svg> Payment errors should not cause a deduction in your account balance except stated specifically</span>
          <span><svg></svg> Please do not close or refresh page when a transaction is in progress</span>
          <span><svg></svg> <span className='flex-wrap'>For more support visit <Link href='/help/payments' className='pl-1 text-[var(--deepSweetPurple)]'>payments help</Link></span></span>
        </section>
      </menu>
      <main className={styles.main} style={{paddingTop: '20px', alignSelf: 'center'}}>
        { notify && <Notify message='User is currently on an active subscription.' setCondition={setNotify} condition={reason === 'exclusive'}/>}
        { notify && <Notify message='Current settings are not updated due to unstable internet connection.' types='error' setCondition={setNotify} condition={reason === 'internet'}/>}
        { notify && <Notify message='Please restore stable internet connection for smooth payment.' types='error' setCondition={setNotify} condition={reason === 'socket'}/>}
        { notify && <Notify message='Please be patient while we load your details.' setCondition={setNotify} condition={reason === 'loading'}/>}
        { notify && <Notify message='You do not have any project.' setCondition={setNotify} types='error' condition={reason === 'projects'}/>}
        { notify && <Notify message='Amount should be at most a hundred million.' setCondition={setNotify} condition={reason === 'amount'}/>}
        <h2 className={style.title}>{TagSvg('big')} Payments</h2>
        <div className={style.features}>
          <section id={style.chats}>
            <div>
              <p>Secured payments</p>
              <span className={style.l}></span>
              { rev ? Padlocksvg(`${style.left} ${style.svg}`) : TagSvg(`${style.left} ${style.svg}`)}{ rev ? Rocketsvg(`${style.right} ${style.svg}`) : ShortPayStackSvg(`${style.right} ${style.svg}`)}
              <span className={style.r}></span>
              <Link href="/help/payments">Learn more {Leftsvg()}</Link>
            </div>
          </section>
          <form className={style.form}>
            <h2>Send a tok-<em className='short_logo'>en</em></h2>
            <div className={style.input}>
              <input type="text" name='name' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName( e.target.value )} placeholder="Payee's name"/>
            </div>
            <div className={style.input}>
              <input type="email" name='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail( user ? user.email : e.target.value)} placeholder="Payee's email"/>
            </div>
            <div className={style.input}>
              <input type="text" name='' inputMode='decimal' value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                const num = Number(raw) / 100;
                const decimal = num.toFixed(2)
                const val = `${[...decimal].map((n: string, i: number) => ( decimal.length - 1 - i) % 3 === 0 && i < decimal.length  - 4 ? `${n} ` : n ).join('')}`
                if ( num > 100000000 ) {
                  setNotify(true)
                  setReason('amount')
                } else setAmount(val)
              }} placeholder='0.00'/>
              <NewDropSets props={{
                listen: true,
                id: 'currrency',
                query: currency,
                class: style.inView,
                buttons: [
                  { txt: 'Naira', query: 'NGN', func: ()=>setCurrency('NGN')},
                  {txt: 'Cedi', query: 'GHS', func: ()=>setCurrency('GHS')},
                  {txt: 'KES', query: 'KES', func: ()=>setCurrency('KES')},
                  {txt: 'US Dollar', query: 'USD', func: ()=>setCurrency('USD')}
                ]
              }}/>
            </div>
            <div className={style.input}>
              <input type="text" name='phone-number' value={`${number}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setNumber(raw)
              }} placeholder='Enter phone number'/>
            </div>
            <div className={style.input}>
              <ChatInput placeholder='Payment description' value={desc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setDesc(e.target.value)} maxHeight='150px'/>
            </div>
            <div className={style.holders}>
              <p className={style.error} style={{ minHeight: '20px' ,minWidth: '100%', color: isLoading ? 'var(--changingPurple)' :  'var(--error)'}}>{err}</p>
              <button style={{paddingBlock: '10px'}} onClick={handlePay} disabled={loading}> {PayStackSvg('min-w-32 min-h-4')}</button>
              <button onClick={handlePay} disabled={loading}> {FlutterWaveSvg('min-w-36 min-h-7')}</button>
            </div>
            <p className='text-center'><span>Or</span></p>
            <div className={style.holders}>
              <button style={{minWidth: '216px'}} onClick={handleRenew} disabled={loading}> {Prosvg()} <span>Renew</span> Subscription</button>
              <button style={{minWidth: '216px'}} disabled={loading} onClick={handlePayProjects}> {Rocketsvg('BIG')} Project <span>Payments </span></button>
              <button disabled={loading} onClick={handlePayTutorials}> {PlaySvg()} Pay for tutorial</button>
            </div>
          </form>
          <p className={style.text}>Payment refunds are not feasible except as stated in Cod-en <Link href='/help/payments' className='text-[var(--soft)]'>payment terms.</Link></p>
        </div>
      </main>
      <Footer />
    </main>
  )
}

export default Payments