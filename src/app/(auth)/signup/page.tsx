'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../page.module.css'
import { signIn } from 'next-auth/react'
import { Githubsvg, GoogleG, loaderCircleSvg } from '@/src/components/svgPack'
import { CheckIncludes, classAdd, classRemove, pick } from '@/src/components/functions'

const Signup = () => {
  const [ err, setErr ] = useState('')
  const [ name, setName ] = useState('')
  const [ pass, setPass ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ label1, setLabel1 ] = useState('Username')
  const [ label2, setLabel2 ] = useState('you@example.com')
  const [ label3, setLabel3 ] = useState('Create password')

  const GoogleSignUp = async () => {
    await signIn('google')
  }
  const GithubSignUp = async () => {
    await signIn('github')
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return setErr('Please fill in name field')
    if (!email) return setErr('Please fill in email field')
    if (!pass) return setErr('Please fill in password field')
    if (pass.length < 6) return setErr('Password is too short')
    if (name.trim().length < 4) return setErr('Username is too short')
    setErr('')
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type':'application.json'
      },
      body: JSON.stringify({name, email, password: pass})
    })

    const contentType = res.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
      setLoading(false)
      setErr('Unexpected server error. Try again later')
      return
    }
    const { ok } = res
    const json = await res.json()
    if(!ok) setErr(json.error)
    else {
      await signIn('credentials', {email, password: pass})
    }
    setLoading(false)
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
          <input name='password' type="text" autoComplete='true' autoCorrect='true' value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPass(e.target.value.trim()); setErr('')}}  onFocus={()=>{classAdd('#password label', styles.inView); setLabel3('Use at least six characters')}}/>
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
    </main>
  )
}

export default Signup
