'use client'
import Link from 'next/link'
import style from './page.module.css'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import styles from './../main.module.css'
import Footer from '@/src/components/Footer'
import stylez from './../contact/page.module.css'
import { PasswordInput } from '@/src/components/ChatBox'
import { classToggle } from '@/src/components/functions'
import { Githubsvg, GoogleG, loaderCircleSvg, Padlocksvg, Rocketsvg, Infosvg } from '@/src/components/svgPack'


const Recovery = () => {
  const [ err, setErr ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ backup, setBackup ] = useState('')
  const [ answer, setAnswer ] = useState('')
  const [ mode, setMode ] = useState('email')
  const [ question, setQuestion ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const GoogleRecovery = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    document.cookie = `recovery_mode=true; path=/; max-age=300`;
    const res = await signIn('google', { redirect: false })
    if (res?.error) setErr(res.error)
    setLoading(false)
  }
  const GithubRecovery = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    document.cookie = `recovery_mode=true; path=/; max-age=300`;
    const res = await signIn('github', { redirect: false })
    if (res?.error) setErr(res.error)
    setLoading(false)
  }
  const handleRecover = async (e: React.FormEvent) => {
    setErr('')
    e.preventDefault()
    if (!answer) return setErr('Please fill in answer field')
    if (!question) return setErr('Please fill in question field')
    if ( mode === 'backup' && !backup ) setErr('Please fill in backup email field')
    if ( mode === 'email' && !email ) setErr('Please fill in email field')
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
        method: 'PATCH',
        headers: {
          'Content-Type':'application.json'
        },
        body: JSON.stringify({ backup , email , question , answer })
      })
  
      const contentType = res.headers.get('content-type')
  
      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setErr('Unexpected server error. Try again later')
        return
      }
      const { ok } = res
      const json = await res.json()
      if(!ok) setErr(json.error || 'Unexpected server error. Try again later')
      if(ok) {
        await signIn('credentials', {
          redirect: false,
          email: json.email,
          password: json.password,
          callbackUrl: '/dashboard'
        })
      }
      setLoading(false)
  }
  return (
    <main className={`gap-7 flex flex-col justify-center items-center mx-auto ${styles.main}`}>
      <div className={stylez.background} ></div>
      <menu id={style.fill} onClick={()=>classToggle(`#${style.fill}`, style.inView)}>
      <button>{Infosvg()} Info</button>
      <section className={style.autoFill}>
        <span><svg></svg> Passwords are automatically reset to characters before the first &quot;@&quot; symbol of your email (or backup-email for non-custom accounts)</span>
        <span><svg></svg> Passwords are encrytped and cannot be retrieved even by Cod-en team except by recovery</span>
        <span><svg></svg> Keep passwords safe</span>
        <span><svg></svg> <span className='flex-wrap'>For more support visit <Link href='/help/recovery' className='pl-1 text-[var(--deepSweetPurple)]'>recovery help</Link></span></span>
      </section>
    </menu>
      <form className={style.form} onSubmit={handleRecover}>
        <h2>{Padlocksvg('min-w-7 min-h-7 BIG')} Account Recovery</h2>
        <section>
          <p>Recover account with {mode === 'backup' && 'backup'} email </p>
          <PasswordInput
            name={mode}
            classes={style.input}
            value={ mode === 'email' ? email : backup }
            placeholder={`Enter ${mode === 'email' ? '' : 'backup'} email`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=> mode === 'email' ? setEmail(()=> e.target.value.trim()) : setBackup(()=> e.target.value.trim())}
            />
        </section>
        <section>
          <p>Enter a recovery question set </p>
          <PasswordInput
            name='question'
            value={question}
            classes={style.input}
            placeholder={'Enter recovery question'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setQuestion(()=> e.target.value.endsWith('  ') ? e.target.value.slice(0, -1) : e.target.value)}
            />
          <PasswordInput
            name='answer'
            value={answer}
            classes={style.input}
            placeholder={'Enter corresponding answer'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setAnswer(()=> e.target.value.endsWith('  ') ? e.target.value.slice(0, -1) : e.target.value)}
            />
        </section>
        <div className='justify-end'>
          <p className={style.error}>{err}</p>
          <button onClick={handleRecover} disabled={loading}> {loading ? loaderCircleSvg() : Rocketsvg('big')} Recover{loading && 'ing...'}</button>
        </div>
        <div className='justify-between'>
          <button onClick={GoogleRecovery} disabled={loading}> {GoogleG('isBig')} Recover <span>Google account</span></button>
          <button onClick={GithubRecovery} disabled={loading}> {Githubsvg('BIG')} Recover <span>Github account</span></button>
          <button onClick={(e: React.FormEvent)=>{e.preventDefault(); setMode((prev: string) => prev ===  'email' ? 'backup' : 'email' )}} disabled={loading}>Use { mode === 'email' ? 'backup' : 'email' } instead</button>
        </div>
      </form>
    <Footer />
  </main>
  )
}

export default Recovery
