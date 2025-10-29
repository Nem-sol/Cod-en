'use client'
import Link from 'next/link'
import style from './page.module.css'
import styles from '../main.module.css'
import { signOut } from 'next-auth/react'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { PasswordInput } from '@/src/components/ChatBox'
import { useUserContext } from '@/src/context/UserProvider'
import { CheckIncludes, FirstCase } from '@/src/components/functions'
import { Editsvg, EyeClosedSvg, Eyesvg, Githubsvg, LogoutSvg, Padlocksvg, Refreshsvg, SettingSvg, Packssvg, GoogleG, Cloudsvg, AddSvg, Rocketsvg, Leftsvg, loaderCircleSvg, checkmarkSvg, DeleteSvg } from '@/src/components/svgPack'

type sets = {
  answer: string
  question: string
}

type User ={
  name: string
  role: string
  email: string
  provider: string
  createdAt: string
  updatedAt: string
  exclusive: boolean
  backupEmail:  string | null
  recoveryQuestions: string[]
}

const Settings = () => {
  const [ er , setEr ] = useState('')
  const [ err , setErr ] = useState('')
  const [ pass , setPass ] = useState('')
  const [ name , setName ] = useState('')
  const [ email , setEmail ] = useState('')
  const [ backup , setBackup ] = useState('')
  const [ ready , setReady ] = useState(false)
  const [ update , setUpdate ] = useState(false)
  const [ verify , setVerify ] = useState(false)
  const [ success, setSuccess ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ password , setPassword ] = useState('')
  const [ deleting , setDeleting ] = useState(false)
  const [ disclose , setDisclose ] = useState(false)
  const [ changeArr , setChangeArr ] = useState([''])
  const [ recovery , setRecovery ] = useState([{question: '', answer: ''}])
  const { userDetails: user, error , setRefresh , setUserDetails } = useUserContext()
  const stringArr = changeArr.map((k: string, i: number) => i < changeArr.length - 1 ? k : '').filter((k: string)=> k !== '')

  const handleClick = (e: React.MouseEvent<HTMLFormElement>)=>{!CheckIncludes(e, `.${style.updator} menu`) && !CheckIncludes(e, `.${style.updator} input`) &&!CheckIncludes(e, `.${style.updator} menu span`) && setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f.question.trim() !== '' && f.answer.trim() !== '')])}

  const handleDelete = async (i: number) => {
    if (!user) return
    if (ready) {
      setDeleting(true)
      if (!password.trim()){
        setEr('Password is required for updates')
        return
      }
      setEr('')
      setLoading(true)
      const res = await fetch('/api/users',{
        method: 'DELETE',
        headers: {
          'Cntent-Type': 'application/json',
          'authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ i , password })
      })
      const contentType = res.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setDeleting(false)
        setEr('Unexpected server error. Try again later')
        return
      }
      const result = await res.json()
      if (!res.ok) setEr(result.error)
      else setUserDetails((prev: User) => {return { ...prev , recoveryQuestions: [...prev.recoveryQuestions.filter((q: string,  n: number ) =>  n !== i )]}})
      setReady(false)
      setPassword('')
      setLoading(false)
      setDeleting(false)
      return
    }
    if (!ready) setReady(true)
  }
  const handleRecovery = async () => {
    if (recovery.length < 1 || !user) return
    setRecovery(( prev: sets[] ) => [...prev.filter((f: sets)=> f.question.trim() !== '' && f.answer.trim() !== '')])
    if (recovery.length < 1 || !user) return
    if (ready){
      if (!password.trim()){
        setEr('Password is required for updates')
        return
      }
      setEr('')
      setLoading(true)
      const res = await fetch('/api/users',{
        method: 'POST',
        headers: {
          'Cntent-Type': 'application/json',
          'authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ recoveryQuestions: recovery , password})
      })
      const contentType = res.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setEr('Unexpected server error. Try again later')
        return
      }
      const result = await res.json()
      !res.ok && setErr(result.error)
      if (res.ok) {
        setRecovery([])
        setSuccess(true)
        setEr('Updates successful')
        setTimeout(()=>{ setSuccess(false); setEr('')}, 1500)
        setUserDetails((prev: User) => {return { ...prev , ...result }})
      }
      setReady(false)
      setPassword('')
      setLoading(false)
      return
    }
    if (!recovery.find((f: sets)=> f.question.trim() !== '' && f.answer.trim() !== '')) setEr('Recovery questions and answers must contain non-empty fields')
    if (!ready && recovery.find((f: sets)=> f.question.trim() !== '' && f.answer.trim() !== '')) setReady(true)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    setChangeArr([])
    e.preventDefault()
    const n = name.trim()
    const p = pass.trim()
    const em = email.trim()
    const be = backup.trim()
    const pw = password.trim()
    if(n) setChangeArr(( prev: string[] ) => [ ... prev , 'name'])
    if(em) setChangeArr(( prev: string[] ) => [ ... prev , 'email'])
    if(be) setChangeArr(( prev: string[] ) => [ ... prev , 'back-up email'])
    if(p.length > 6) setChangeArr(( prev: string[] ) => [ ... prev , 'password'])
    if (!n && !em && !p && !be ) setErr('At least one field must be filled')
    else if (n && n.length < 4 ) setErr('User name is too short.')
    else if (em && (!em.includes('@') || !em.includes('.com'))) setErr('Enter valid email adress.')
    else if (em && em.length < 12 ) setErr('Email is too short.')
    else if (p && p.length < 6) setErr('Password is too short')
    else if (be && (!be.includes('@') || !be.includes('.com'))) setErr('Enter valid back-up adress.')
    else if (be && be.length < 12 ) setErr('Backup-email is too short.')
    else if (be && em && be === em ) setErr('Email cannot be used as back-up')
    else if (!verify) {
      setErr('')
      setVerify(true)
      setPassword('')
    }
    else {
      if (!pw) {
        setErr('Password required too confirm changes'); return
      }
      setErr('')
      setLoading(true)
      const res = await fetch('/api/users',{
        method: 'POST',
        headers: {
          'Cntent-Type': 'application/json',
          'authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ name , email , newPassword: pass , password , backup })
      })
      const contentType = res.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        setLoading(false)
        setErr('Unexpected server error. Try again later')
        return
      }
      const result = await res.json()
      if(!res.ok) setErr(result.error)
      else {
        setSuccess(true)
        setErr('Updates successful')
        setUserDetails((prev: User) => { return { ...prev , ...result }})
      }
      setPass('')
      setName('')
      setEmail('')
      setBackup('')
      setPassword('')
      setLoading(false)
      setTimeout(()=>{setVerify(false); setErr(''); setSuccess(false)}, 1500)
    }
  }
  useEffect(()=>{
    setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f.question.trim() !== '' || f.answer.trim() !== '')])
  }, [])
  return (
    <main id={styles.main} onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
      !CheckIncludes(e, `.${style.button}`) &&!CheckIncludes(e, `.${style.responses}`) &&!CheckIncludes(e, `.${style.responses} input`) && setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f.question.trim() !== '' || f.answer.trim() !== '')])}}>
      <div className={styles.main}>
        <h2 className={styles.title}>{SettingSvg()} Settings</h2>
        <div className={styles.quick}>
          <button onClick={()=>setDisclose((prev: boolean) => !prev)}>{!disclose ? Eyesvg('min-w-8') : EyeClosedSvg('min-w-8')}{!disclose ? 'View' : 'Hide'} credentials</button>
          { user && user.provider === 'custom' && <button className={styles.second} onClick={()=> setUpdate(true)}>{Editsvg()} Update credentials</button>}
          <Link href='/recovery' className={user && user.provider === 'custom' ? styles.third : styles.second}>{Padlocksvg('isBig')} Account recovery</Link>
        </div>
        <div className='flex gap-y-12 flex-col mt-5'>
          <div className={style.setts}>
            <span>{user ? FirstCase(user.role) : 'Guest'} profile</span>
            <p>{user ? disclose ? user.name : '*****' : 'Guest'}</p>
            <p>{user ? disclose ? user.email : '*****' : 'Email: Not set'}</p>
            {user && <p className='text-[var(--deepSweetPurple)]'>{user.provider === 'custom' ? 'Passwords are encrypted and not displayed for security reasons' : 'Passwords are managed by your provider'}</p>}
            {!user && <p className='text-[var(--deepSweetPurple)]'>Sign up with Coden+ and create your password</p>}
          </div>
          <div className={style.setts}>
            <span>Back-up email</span>
            <p>{user && user.backupEmail ? disclose ? user.backupEmail : '*****' : 'Not set'}</p>
            <p className='flex justify-end'>{<button className={style.button} onClick={()=>setUpdate(true)}>{Editsvg('isBig')} {user?.backupEmail ? 'Change' : 'Add'}</button>}</p>
          </div>
          <div className='flex font-medium gap-2.5 text-[1em] text-[var(--changingPurple)] border-t-[#9f76a0] border-t-2 mx-5 flex-col'>
            <p className='flex gap-2.5 items-center p-2 transition-[0.5s]'>{Packssvg('BIG')} Subscriptions <span>{user && user.exclusive ? 'Active' : 'Inactive'}</span></p>
            {user && <p className='flex gap-2.5 items-center p-2 transition-[0.5s]'>{user.provider === 'github' ? Githubsvg() : user.provider === 'google' ? GoogleG() : Cloudsvg()} Provider <span>{user ? FirstCase(user.provider) : 'Custom'} provider</span></p>}
            {!user && <p className='flex gap-2.5 items-center p-2 transition-[0.5s]'> {Cloudsvg()} Provider <span> Custom</span></p>}
          </div>
          <div className={style.setts}>
            <span>Recovery questions</span>
            <p>Slots - {user ? user.recoveryQuestions.length : 0}/3</p>
            {err && !recovery.length && <p style={success ? {color: 'var(--success)'} : {}} className='text-[var(--error)] max-w-2xl w-full'>{er}</p>}
            {user && user.recoveryQuestions.map((ques: string, i: number)=><div className={style.reco} key={i}>{ disclose ? ques : '****'} <button style={deleting ? {opacity: 1} : {}} onClick={()=> handleDelete(i)}>{ loading ? loaderCircleSvg() : deleting? DeleteSvg() : AddSvg()}</button></div>)}
            
            {recovery.map((inp: sets, i: number)=>{
              return <>
                <div className={style.responses} key={i}>
                  <input type="text" name={'questions' + i} placeholder='Enter new question' value={inp.question} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
                      setRecovery(
                        (prev: sets[]) =>[...prev.map((f: sets, n: number)=>  n === i ? {...f, question: e.target.value} : f)]
                    )}
                    onClick={() => setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f === inp || (f.question.trim() !== '' && f.answer.trim() !== ''))])}
                  />
                </div>
                <menu className={`${style.responses} ${style.answer}`} key={i + 3}>
                  <input type="text" name={'answers'+ i} placeholder='Enter corresponding answer' value={inp.answer} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
                    setRecovery(
                      (prev: sets[]) =>[...prev.map((f: sets, n: number)=>  n === i ? {...f, answer: e.target.value} : f)]
                    )}
                    onClick={() => setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f === inp || (f.question.trim() !== '' && f.answer.trim() !== ''))])}
                  />
                </menu>
              </>
            })}
            {ready && <PasswordInput value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value.trim())} classes={style.password} placeholder="Enter current password" />}
            {recovery.length > 0 && <p className='text-[var(--sweetPurple)] self-center items-center flex gap-1'>{Padlocksvg('big min-w-7')} Recovery answers cannot be displayed after creation</p>}
            {user && user.recoveryQuestions.length < 3 && user.provider === 'custom' && <h3 className='flex-wrap flex justify-end items-center gap-2.5'>
              <p style={success ? {color: 'var(--success)'} : {}} className='text-[var(--error)] max-w-2xl w-full'>{er}</p>
              <p className='min-w-fit flex gap-2.5'>{recovery.length > 0 && <button className={style.button} onClick={handleRecovery}>{loading ? loaderCircleSvg() : checkmarkSvg('isBig')} { loading ?  'Saving...' : 'Save' }</button>}
              <button className={style.button} onClick={()=> {setEr(''); user.recoveryQuestions.length + recovery.length < 3 && setRecovery(( prev: sets[] )=> [...prev.filter((f: sets)=> f.question.trim() !== '' || f.answer.trim() !== ''), {question: '', answer: ''}])}}>{AddSvg('isBig')} Add </button></p></h3>}
          </div>
          <p className='flex gap-4'>
            {error && <button className={style.button} onClick={()=>setRefresh((prev : boolean)=> !prev)}>{Refreshsvg()} Refresh details</button>}
            {user && <button className={style.button + ' text-[var(--error)!important]'} onClick={()=>signOut()}>{LogoutSvg()} Log out</button>}
            {user && user.provider === 'custom' && <button className={style. button} onClick={()=> setUpdate(true)}>{Editsvg()} Update credentials</button>}
          </p>
        </div>
        {update && <>
          <div className={style.mask} onClick={()=>{setUpdate(false); setVerify(false) ;setPassword(''); setErr('')}}></div>
          <form className={style.updator} onClick={handleClick}>
            <div className={style.finish} style={{position: 'absolute', top: '-12px', insetInline: 0, zIndex: 1}}> <hr style={{rotate: '180deg'}}/> </div>
            <div className={style.holder} style={{translate:  verify ? '-50%' : 0}}>
              <section style={{gap: '25px'}}>
                <span>Update credentials</span>
                <h3 className='text-[var(--changingPurple)]'>{Editsvg('BIG')} Update only desired fields</h3>
                {user?.provider === 'custom' && <div className={style.input}>
                  <p>User name</p>
                  <input type="text" name='name' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value.endsWith('  ') ? e.target.value.slice(0, -1) : e.target.value )}/>
                </div>}
                {user?.provider === 'custom' && <div className={style.input}>
                  <p>Email</p>
                  <input type="email" name='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}/>
                </div>}
                <div className={style.input}>
                  <p>Password</p>
                  <input type="text" name='password' value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPass(e.target.value.trim())}/>
                </div>
                <div className={style.input}>
                  <p>Back-up email</p>
                  <input type="email" name='backup' value={backup} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setBackup(e.target.value)}/>
                </div>
              </section>
              <section>
                <span>Confirm updates</span>
                <h2>Confirm updates to change &quot;{stringArr.length > 0 && stringArr.join(', ') + ' and '}{changeArr[changeArr.length - 1]}&quot;</h2>
                { name && <h3> <ul>Name</ul> <ol>{name}</ol></h3>}
                { email && <h3> <ul>Email</ul> <ol>{email}</ol></h3>}
                { pass && <h3> <ul>Password</ul> <ol>{pass}</ol></h3>}
                { backup && <h3> <ul>Back-up email</ul> <ol>{backup}</ol></h3>}
                <PasswordInput value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value.trim())} classes={style.password} style={success ? {pointerEvents: 'none'} : {}} placeholder="Enter current password" />
              </section>
            </div>
            <div className={style.finish}>
              <hr />
              {verify && <button style={{backgroundColor: 'var(--error)', color: 'white', paddingLeft: '10px', paddingRight: '17px'}} onClick={(e: React.MouseEvent<HTMLButtonElement>)=>{e.preventDefault; setVerify(false); setPassword(''); setErr('')}}>{Leftsvg('p-1 rotate-180')} Back</button>}
              <button style={verify ? {backgroundColor: 'var(--success)', color: 'white'} : {}} className={!verify ? 'bg-[var(--sweetPurple)]' : ''} onClick={handleSubmit} disabled={verify && (password.length < 6 || loading)}>{verify ? 'Confirm' : 'Submit'} { loading ? loaderCircleSvg() : verify ? Rocketsvg('big') : Leftsvg('p-1')}</button>
              <h4 style={success ? {color: 'var(--success)'} : {}}>{err}</h4>
            </div>
          </form>
          </>}
      </div>
      <Footer />
    </main>
  )
}

export default Settings
