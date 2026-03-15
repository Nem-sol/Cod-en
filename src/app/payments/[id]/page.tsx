'use client'
import Link from 'next/link'
import style from './../page.module.css'
import { useParams } from 'next/navigation'
import styles from './../../main.module.css'
import Footer from '@/src/components/Footer'
import ChatInput from '@/src/components/ChatBox'
import React, { useEffect, useState } from 'react'
import stylez from './../../recovery/page.module.css'
import { useSocket } from '@/src/context/SocketContext'
import { useUserContext } from '@/src/context/UserProvider'
import { useProjectContext } from '@/src/context/ProjectContext'
import { NewDropSets, Notify } from '@/src/components/pageParts'
import { classToggle, FirstCase, pickAll } from '@/src/components/functions'
import { TagSvg, FlutterWaveSvg, PayStackSvg, Infosvg } from '@/src/components/svgPack'

const Payment = () => {
  const { id: idParam } = useParams()
  const { socket , ready } = useSocket()
  const { userDetails: user } = useUserContext()
  const { project: projects , isLoading , error } = useProjectContext()

  const id = String( idParam )

  // Add tutorial instance constant here
  const projectInstance = projects.find( project => project._id === id )
  const context = projectInstance ? { isNow: 'project' , ...projectInstance } : /** Add tutorial instance query here ... **/ null 

  const Form = () => {
    const [ err , setError ] = useState('')
    const [ number , setNumber ] = useState('')
    const [ reason , setReason ] = useState('')
    const [ method , setMethod ] = useState('')
    const [ amount , setAmount ] = useState('0')
    const [ notify , setNotify ] = useState(false)
    const [ provider , setProvider ] = useState('')
    const [ loading , setLoading ] = useState( false )
    const [ name , setName ] = useState( user?.name || '' )
    const [ email , setEmail ] = useState( user?.email || '')
    const [ type , setType ] = useState( context?.isNow || '')
    const [ currency , setCurrency ] = useState( context?.currency || 'NGN' )

    const handlePay = async (e: React.FormEvent) => {
      setError('')
      e.preventDefault()
      const maxPayment = context?.isNow === 'project' ? ( 100 - context.paymentLevel ) * context.price : 100000000
      if (!user) return setError('Sign in to make payment or gift token from payment page.')
      if (!context) return setError('Could not target a service. Try gifting instead')

      if (!email) return setError("Payer's email is required")
      if (number && number.length < 11 ) return setError('Enter a valid phone number')
      if ( Number(amount.trim()) < context?.price / 10 ) return setError('Amount is too small')
      if ( Number(amount.trim()) > maxPayment ) return setError('Amount is too small')
      if ( error || !ready ) {
        setReason('socket')
        setNotify(true)
        return
      }
      
      let prov = ''
      setLoading(true)
      pickAll(`.${style.form} button`).forEach(( i , n: number )=> {
        if ( i === e.target && n === 0 ) prov = 'paystack'
        else if ( i === e.target && n === 1 ) prov = 'flutterwave'
        setProvider( prov )
      })
      const desc = `${FirstCase(provider)} ${type} payment from ${ name || user?.name } of ${currency} ${amount} for ${context?.name}`

      socket?.emit(`${type}-payments`, { type , desc , email , method , currency, provider: prov , targetId: id , userId: user.id , amount: Number(amount.trim()) });
    }

    useEffect(()=>{
      if (!context) return
      setType( context.isNow )
    }, [ context ])

    return (
      <form className={style.form}>
        { notify && <Notify message='Amount should be at most a hundred million.' setCondition={setNotify} condition={reason === 'amount'}/>}
        { notify && <Notify message='Please restore stable internet connection for smooth payment.' types='error' setCondition={setNotify} condition={reason === 'socket'}/>}
        <h2> Make paym<em className='short_logo'>en</em>t</h2>
        <div className={style.input}>
          <input type="text" name='name' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName( e.target.value )} placeholder="Payee's name"/>
        </div>
        <div className={style.input}>
          <input type="email" name='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail( e.target.value )} placeholder="Payee's email"/>
        </div>
        <div className={style.input}>
          <input type="text" name='amount' inputMode='decimal' value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          <input type="text" inputMode='decimal' name='phone-number' value={`${number}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            setNumber(raw)
          }} placeholder='Enter phone number'/>
        </div>
        <div className={style.input} aria-disabled>
          <textarea
            disabled
            placeholder='Payment description'
            style={{ resize: 'none' , maxHeight: '75px' , height: 'fit-content' }}
            value={`${FirstCase(type)} ${ type ? 'payment' : 'Payment'} from ${ name || user?.name } of ${currency} ${amount}${ context ? ' for ' : '' }${context?.name || ''}`}/>
        </div>
        <div className={style.holders}>
          <p className='text-center text-[1.2em]'><span>Pay with</span></p>
          <p className={style.error} style={{ minHeight: '20px' ,minWidth: '100%', color: isLoading ? 'var(--changingPurple)' :  'var(--error)'}}>{err}</p>
          <button style={{paddingBlock: '10px'}} onClick={handlePay} disabled={loading}> {PayStackSvg('min-w-32 min-h-4')}</button>
          <button onClick={handlePay} disabled={loading}> {FlutterWaveSvg('min-w-36 min-h-7')}</button>
        </div>
      </form>
    )
  }
  return (
    <main id={styles.main} style={{maxWidth: '100%'}}>
      <div className={style.background} ></div>
      <menu id={stylez.fill} onClick={()=>classToggle(`#${stylez.fill}`, stylez.inView)}>
        <button>{Infosvg()} Info</button>
        <section className={stylez.autoFill}>
          <span><svg></svg> Payee&apos;s name and email should be of the account owner from which money is to be sent</span>
          <span><svg></svg> Payment errors should not cause a deduction in your account balance except stated specifically</span>
          <span><svg></svg> Please do not close or refresh page when a transaction is in progress</span>
          <span><svg></svg> <span className='flex-wrap'>For more support visit <Link href='/help/payments' className='pl-1 text-[var(--deepSweetPurple)]'>payments help</Link></span></span>
        </section>
      </menu>
      <main className={styles.main} style={{paddingTop: '20px', alignSelf: 'center'}}>
        <h2 className={style.title}>{TagSvg('big')} { !context ? 'Payments' : `${FirstCase(context.isNow)} payment - ${context.name}`}</h2>
        <div className={style.features}>
          <Form />
          <p className={style.text}>Payment refunds are not feasible except as stated in Cod-en <Link href='/help/payments' className='text-[var(--soft)]'>payment terms.</Link></p>
        </div>
      </main>
      <Footer />
    </main>
  )
}

export default Payment