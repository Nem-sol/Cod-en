'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../page.module.css'
import { signIn } from 'next-auth/react'
import Footer from '@/src/components/Footer'
import { PasswordInput } from '@/src/components/ChatBox'
import { Githubsvg, GoogleG, loaderCircleSvg } from '@/src/components/svgPack'

const SignIn = () => {
  const [ err, setErr ] = useState('')
  const [ pass, setPass ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const GoogleSignIn = async () => {
    setLoading(true)
    const res = await signIn('google', { redirect: false , callbackUrl: '/dashboard'})
    if (res?.error) setErr(res.error)
    setLoading(false)
  }
  const GithubSignIn = async () => {
    setLoading(true)
    const res = await signIn('github', { redirect: false , callbackUrl: '/dashboard'})
    if (res?.error) setErr(res.error)
    setLoading(false)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    setErr('')
    e.preventDefault()
    if (!email) return setErr('Please fill in email field')
    if (!pass) return setErr('Please fill in password field')
    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password: pass,
      redirect: false
    })
    if (res?.error) setErr(res.error)
    setLoading(false)
  }
  return (
    <main className='gap-7 flex flex-col justify-center items-center'>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <div className={styles.inputPack} id='email'>
          <input value={email} name='email' type="text" autoComplete='true' autoCorrect='true' placeholder='Enter email' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setEmail(e.target.value); setErr('')}}/>
        </div>
        <PasswordInput value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value.trim())} classes={styles.inputPack} placeholder="Enter current password" />
        <p className='flex-1 self-start min-h-5'>{err}</p>
        <p className='flex gap-1 w-full justify-between items-center'><Link href='/recovery' className='text-[var(--changingPurple)]'>Forgot password</Link><button disabled={loading}>{loading && loaderCircleSvg()}{loading ? 'Logging in...' : 'Sign in'}</button></p>
      </form>
      <p className={styles.or}><span>Or</span></p>
      <div className={styles.options}>
        <button onClick={()=>GoogleSignIn()} disabled={loading}>{GoogleG()} Sign in <span>with Google</span></button>
        <button onClick={()=>GithubSignIn()} disabled={loading}>{Githubsvg()} Sign in <span>with Github</span></button>
      </div>
      <p className='text-end pr-14 max-w-2xl w-full'>New to Cod-en? <Link href='/signup' style={{color: 'var(--compliment)'}}>Sign up</Link> </p>
      <Footer />
    </main>
  )
}

export default SignIn
