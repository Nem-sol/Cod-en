'use client'
import Link from 'next/link'
import styles from '../page.module.css'
import { signIn } from 'next-auth/react'
import Footer from '@/src/components/Footer'
import style from '../../settings/page.module.css'
import React, { useEffect, useState } from 'react'
import { PasswordInput } from '@/src/components/ChatBox'
import { useEmail } from '@/src/context/ProtectionProvider'
import { Githubsvg, GoogleG, loaderCircleSvg } from '@/src/components/svgPack'
import { CheckIncludes, classAdd, classRemove, pick } from '@/src/components/functions'

const Signup = () => {
  const [ err, setErr ] = useState('')
  const [ code, setCode ] = useState('')
  const [ name, setName ] = useState('')
  const [ pass, setPass ] = useState('')
  const { email, setEmail } = useEmail()
  const [ done, setDone ] = useState(false)
  const [ verify, setVerify ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ label1, setLabel1 ] = useState('Username')
  const [ label2, setLabel2 ] = useState('you@example.com')
  const [ label3, setLabel3 ] = useState('Create password')

  const GoogleSignUp = async () => {
    await signIn('google' , { redirect: false })
  }
  const GithubSignUp = async () => {
    await signIn('github' , { redirect: false })
  }
  const validate = () => {
    if (!name) {
      setErr('Please fill in name field')
      return false
    } else if (!email) {
      setErr('Please fill in email field')
      return false
    } else if (!pass) {
      setErr('Please fill in password field')
      return false
    } else if (pass.length < 6) {
      setErr('Password is too short')
      return false
    } else if (name.trim().length < 4) {
      setErr('Username is too short')
      return false
    } 
    setErr('')
    setLoading(true)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type':'application.json'
      },
      body: JSON.stringify({ name , email , password: pass , code: null })
    })

    const contentType = res.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
      setLoading(false)
      setErr('Unexpected server error. Try again later')
      return
    }
    const json = await res.json()
    if( !res.ok ) {
      if (json.error === 'OTP sent to email sucessfully') setVerify(true)
      else setErr(json.error)
      setLoading(false)
    }
    else await signIn('credentials', { email , password: pass })
    setLoading(false)
  }

  
  const handleVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if ( loading ) return
    const codes = e.target.value.trim().toUpperCase().replace(/[^0-9] + [^A-Z]/g, "");
    setCode(codes)
    if (codes.length === 8 ) {
      if (!validate()) return
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type':'application.json'
        },
        body: JSON.stringify({name , email , password: pass , code: codes })
      })

      const contentType = res.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setErr('Unexpected server error. Try again later')
        return
      }
      const json = await res.json()
      if (!res.ok) setErr(json.error)
      else {
        setDone( true )
        await signIn('credentials', { email , password: pass })
      }
      setLoading(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) =>{
    if(!CheckIncludes(e, `.${styles.inputPack}`) && !CheckIncludes(e, `.${styles.inputPack} input`)){
      if(!name && !pick('#name input:focus')){
        classRemove('#name label', styles.inView); (setLabel1('Username'))
      }
      if(!email && !pick('#email input:focus')){
        classRemove('#email label', styles.inView); setLabel2('you@example.com')
      }
      if(!pass && !pick('#password input:focus')){
        classRemove('#password label', styles.inView); setLabel3('Create password')
      }
    }
  }
  const checkStart = () =>{if (email) {classAdd('#email label', styles.inView); setLabel2('Enter email address')}}
  useEffect(checkStart, [])
  return (
    <main className='gap-7 flex flex-col justify-center items-center' onMouseMove={handleMouseMove}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <div className={styles.inputPack} id='name'
          onMouseMove={()=>{classAdd('#name label', styles.inView); setLabel1('Enter your legal name')}}>
          <label htmlFor='name'>{label1}</label>
          <input name='name' type="text" autoComplete='true' autoCorrect='true' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setName(( prev: string ) => prev.endsWith(' ') ? e.target.value.trim() : e.target.value); setErr('')}} onFocus={()=>{classAdd('#name label', styles.inView); setLabel1('Create your unique username')}}/>
        </div>
        <div className={styles.inputPack} id='email'
          onMouseMove={()=>{classAdd('#email label', styles.inView); setLabel2('Enter email address')}}>
          <label htmlFor='email'>{label2}</label>
          <input name='email' type="text" autoComplete='true' autoCorrect='true' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setEmail(e.target.value.trim()); setErr('')}} onFocus={()=>{classAdd('#email label', styles.inView); setLabel2('Enter email address')}}/>
        </div>
        <div className={styles.inputPack} id='password'
          onMouseMove={()=>{classAdd('#password label', styles.inView); setLabel3('Use at least six characters')}}>
          <label htmlFor='password'>{label3}</label>
          <input type="text" autoComplete='true' autoCorrect='true' value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPass(e.target.value.trim()); setErr('')}}  onFocus={()=>{classAdd('#password label', styles.inView); setLabel3('Use at least six characters')}}/>
        </div>
        <p style={{color: 'var(--changingPurple)'}}>Password cannot be retrieved after initialization. Store passwords carefully!</p>
        <div className='flex gap-1 w-full flex-wrap'>
          <p className='flex-1 self-start'>{err}</p>
          <button disabled={loading} className='self-end'>{loading && loaderCircleSvg()}{loading ? 'Signing up...' : 'Sign up'}</button></div>
      </form>
      <p className={styles.or}><span>Or</span></p>
      <div className={styles.options}>
        <button onClick={()=>GoogleSignUp()} disabled={loading}>{GoogleG()} Sign up <span>with Google</span></button>
        <button onClick={()=>GithubSignUp()} disabled={loading}>{Githubsvg()} Sign up <span>with Github</span></button>
      </div>
      <p className='text-end pr-14 max-w-2xl w-full'>Have an account? <Link href='/signin' style={{color: 'var(--compliment)'}}>Log in</Link> </p>
      { verify  && <>
        <div className={style.mask} onClick={()=>{ setErr(''); setCode(''); setVerify(false) }} aria-disabled={ loading } style={{ pointerEvents: loading ? 'none' : 'all' }}></div>
        <div className={styles.verify}>
          <h2>Verify email with Otp</h2>
          <p>{ done ? 'Logging you in..' : loading ? 'Sending...' : 'OTP has been sent to email successfuly'}</p>
          <PasswordInput placeholder='Enter OTP' value={code} onChange={handleVerify} classes={styles.password}/>
          <p style={{ color: 'var(--error)', fontWeight: '600' }}>{err}</p>
          <button onClick={handleSubmit} disabled={loading}>{ done ? 'Sign up success' : 'Resend Otp'}</button>
        </div>
      </>}
      <Footer />
    </main>
  )
}

export default Signup
