'use client'
import Link from 'next/link'
import styles from '../main.module.css'
import { formatDistanceToNow } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '@/src/context/UserProvider'
import { Defaultbg, NewFilterSets } from '@/src/components/pageParts'
import { useNotificationContext } from '@/src/context/NotificationContext'
import { CheckIncludes, classToggle, RemoveAllClass, RemoveOtherClass } from '@/src/components/functions'
import { Backsvg, dblChecksvg, DeleteSvg, HistorySvg, Inboxsvg, Linksvg, loaderCircleSvg, Moresvg, NotificationSvg, Searchsvg } from '@/src/components/svgPack'



const Notification = () => {
  const [ act, setAct ] = useState('')
  const [ filters, setFilters ] = useState('')
  const { userDetails: user } = useUserContext()
  const [ Loading , setIsLoading ] = useState(false)
  const { notifications, error, setRefresh, isLoading , dispatch , unread } = useNotificationContext()

  const handleUpdate = async (notification: any, action: any, setLoading: any) => {
    const id = notification._id

    setLoading(true)
    if (action === 'read'){
      const res = await fetch(`/api/notifications`,{
        method: 'PATCH',
        headers: {
          'authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({id})
      })
      await res.json()
      res.ok && dispatch({type: 'UPDATE_NOTIFICATION', payload: { ...notification, read: true}})
    }
    if (action === 'del'){
      const res = await fetch(`/api/notifications`,{
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({id})
      })
      await res.json()
      res.ok && dispatch({type: 'DELETE_NOTIFICATION', payload: notification})
    }
    setLoading(false)
  }

  const handleMass = async ( act: any ) => {
    setAct(act)
    const action = act.toLocaleLowerCase()
    if (notifications.length < 1) return
    if ( act === 'update' && !unread) return

    setIsLoading(true)
    const res = await fetch(`/api/notifications`,{
      method: 'POST',
      headers: {
        'authorization': `Bearer ${user.id}`,
      },
      body: JSON.stringify({action})
    })
    await res.json()
    res.ok && dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: action !== 'update' ? action === 'delete' && [] : [...notifications.map((n: any)=>{ 
        return {...n, read: true}
      })]
    })
    setIsLoading(false)
  }

  function NotificationPacks({notification}: any) {
    const date = notification.createdAt
    const [ act , setAct ] = useState('')
    const [ loading , setLoading ] = useState(false)
    const [ friendlyDate , setDate ] = useState(formatDistanceToNow(new Date(date), {addSuffix: true}))
    useEffect(()=>{
      let interval = setTimeout(()=>setDate(formatDistanceToNow(new Date(date), {addSuffix: true})), 60000)
      interval
    return ()=>{
      clearTimeout(interval)
    }})
    return (
      <div className={styles.noti} id={`n${notification._id}`}>
        {!notification.read && <span></span>}
        <div>
          <h4 className='font-[700!important]'>{notification.title}</h4>
          <p style={{'display':'flex', 'columnGap':'10px'}}>
            {!notification.read && <button disabled={loading || Loading} onClick={()=>{handleUpdate(notification, 'read', setLoading); setAct('read')}}>{act=== 'read' && loading ? loaderCircleSvg() : dblChecksvg()}</button>}
            {notification.link && <Link href={notification.link}>{Linksvg()}</Link>}
            <button disabled={loading || Loading} onClick={()=>{handleUpdate(notification, 'del', setLoading); setAct('del')}}>{act=== 'del' && loading ? loaderCircleSvg() : DeleteSvg()}</button>
          </p>
        </div>
        <div className='w-11/12 text-justify'>
          {notification.message}
        </div>
        <div style={{justifyContent: 'flex-end'}}>
          <button onClick={()=>{classToggle(`#n${notification._id}`, styles.inView); RemoveOtherClass(`#n${notification._id}`, styles.inView, `.${styles.noti}`)}}>{Moresvg()}</button>
          <div className={styles.details}>
            <p>{notification.read ? 'Read' : 'Unread'}</p>
            <p>For: {notification.target === user.name ? 'User' : notification.target}</p>
            <p>Type: {notification.type}</p>
            <p>Created: {friendlyDate}</p>
          </div>
        </div>
      </div>
    )
  }

  function Filter(filters :  any){
    let result
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = notifications

    if (!notifications) result = null
    else if (filter.trim() === '') filtered = notifications
    else if(filter === 'unread') filtered = filtered.filter(( note: any )=> note.read === false)
    else if (filters === 'payment') filtered = filtered.filter(( note: any )=> note.class.toLocaleLowerCase() === 'payment')
    else if (filters === 'project' || filters === 'log in' || filters === 'profile' || filters === 'subscription') filtered = filtered.filter(( note: any )=> note.type.toLocaleLowerCase() === filters)
    else filtered = filtered.filter(( note: any )=> note.message.toLocaleLowerCase().includes(filter))

    if (filtered && filtered.length > 0) result = filtered.map((not: any, i: any)=> <NotificationPacks key={i} notification={not}/>)
    if (notifications && notifications.length < 1 && error ) return (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: 'Could not get notifications',
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
    else return result ? <div className='flex flex-col pb-40 gap-y-6'>{result}</div> : (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: `You have no ${filter.trim() === '' ? 'new' : 'matching' } notifications`,
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
  }

  return (
    <main id={styles.main} onClick={( e: any)=>{ !CheckIncludes(e, 'menu') && !CheckIncludes(e, 'menu div') && !CheckIncludes(e, 'menu button') && !CheckIncludes(e, 'menu span') && RemoveAllClass( styles.inView , 'menu' ); !CheckIncludes(e, `.${styles.noti} button`) && !CheckIncludes(e, `.${styles.details}`) && !CheckIncludes(e, `.${styles.details} p`) && RemoveAllClass( styles.inView , `.${styles.noti}` )}}>
      <div className={styles.main}>
        <h2 className={styles.title}>{NotificationSvg('BIG')} Notifications</h2>
        <div className={styles.quick}>
          <Link href='/inbox' className={styles.second}>{Inboxsvg('BIG')} Inbox</Link>
          <Link href='/history'>{HistorySvg()} History</Link>
          <button className={styles.third} disabled={Loading} onClick={()=>handleMass('update')}>{ (Loading && act === 'update') ? loaderCircleSvg() : dblChecksvg()} Read all</button>
          <button className={styles.fourth} disabled={Loading} onClick={()=>handleMass('delete')}>{ (Loading && act === 'delete') ? loaderCircleSvg() : DeleteSvg()} Delete all</button>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' type="text" name="search" placeholder='Search from message' onClick={(e: any)=>e.target.classList.add('isTarget')}  onMouseLeave={(e: any)=>e.target.classList.remove('isTarget')} onChange={(e)=>setFilters(e.target.value)}/>
          <NewFilterSets props={{
            id: 'filters',
            query: filters,
            class: styles.inView,
            clicked: styles.clicked,
            reset: ()=>setFilters(''),
            buttons: [
              {txt: 'Blogs', reset: ()=>setFilters('blog'), query: 'blog'},
              {txt: 'Log in', reset: ()=>setFilters('log in'), query: 'log in'},
              {txt: 'Payments', reset: ()=>setFilters('payment'), query: 'payment'},
              {txt: 'Profile', reset: ()=>setFilters('profile'), query: 'profile'},
              {txt: 'Projects', reset: ()=>setFilters('project'), query: 'project'},
              {txt: 'Subscriptions', reset: ()=>setFilters('subscription'), query: 'subscription'},
              {txt: 'Unread', reset: ()=>setFilters('unread'), query: 'unread'},
            ]
          }} />
        </div>
        {isLoading && notifications.length < 1 && 
        <Defaultbg props={{
          styles: styles,
          img: '/homehero.png',
          h2: 'Getting notifications ...',
          text: 'Please be patient while we get your notifications',
        }}/>}
        {(!isLoading || notifications.length > 0) && Filter(filters)}
        {(error || isLoading ) && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: any) => !prev )}>{isLoading ? loaderCircleSvg() : Backsvg()}</button>}
      </div>
    </main>
  )
}

export default Notification
