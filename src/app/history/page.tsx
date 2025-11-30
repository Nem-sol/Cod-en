'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Histories } from '@/types'
import styles from '../main.module.css'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { Copier } from '../../components/pageParts'
import { useUserContext } from '@/src/context/UserProvider'
import { useHistoryContext } from '@/src/context/HistoryContext'
import { Defaultbg, NewFilterSets } from '@/src/components/pageParts'
import { Backsvg, HistorySvg, Inboxsvg, Linksvg, loaderCircleSvg, NotificationSvg, Searchsvg } from '@/src/components/svgPack'

type HistoryPacks = {
  history: Histories
}

const History = () => {
  const [ filters, setFilters ] = useState('')
  const { userDetails: user } = useUserContext()
  const { history, error, setRefresh, isLoading } = useHistoryContext()

  function HistoryPacks({history}: HistoryPacks) {
    const date = history.createdAt
    const friendlyDate  = format(new Date(date), 'h:mm a')
    return (
      <div className={styles.hist}>
        <div className='w-full'>
          <p>{friendlyDate}</p>
          <p className='flex-[0.4]'>{history.title}</p>
          <p>{history.target === user?.name ? 'User' : history.target}</p>
          <p>{history.status}</p>
        </div>
        <div>
          <Link href={'/history/'+history._id}>{Linksvg()}</Link>
          <Copier props={{text: history._id}}/>
        </div>
      </div>
    )
  }

  function Filter(filters:  string){
    let result
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = history

    if (!history) result = null
    else if (filter.trim() === '') filtered = history
    else if (filter === 'payment') filtered = filtered.filter(( hist: Histories )=> hist.class.toLocaleLowerCase() === 'payment')
    else if(filter === 'pending' || filter === 'failed' || filter === 'successful') filtered = filtered.filter(( hist: Histories )=> hist.status === filter)
    else if (filter === 'profile' || filter === 'project' || filter === 'subscription') filtered = filtered.filter((hist: Histories)=> hist.type === filters)
    else filtered = filtered.filter(( hist: Histories )=> hist.title.toLocaleLowerCase().includes(filter))

    if (filtered && filtered.length > 0) result = filtered.map((hist: Histories, i: number)=> <HistoryPacks key={i} history={hist}/>)

    if (history && history.length < 1 && error ) return (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: 'Could not get account history',
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
    else return result ? (
      <div className={styles.hist_Pack}>
        <div className='grid px-5 mb-2.5 gap-2.5 w-full text-center font-medium text-[var(--deepSweetPurple)]' style={{ gridTemplateColumns: '1fr 3fr 2fr 1fr' }}>
          <p>Time</p>
          <p>Title</p>
          <p>Target</p>
          <p>Status</p>
        </div>
        {result}
      </div>) : (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: `You have no ${filter.trim() !== '' ? 'matching' : 'account'} history`,
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
  }

  useEffect(()=>{
    if ( !isLoading && history.length < 1 ) setRefresh(true)
  }, [])

  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{HistorySvg()} History</h2>
        <div className={styles.quick}>
          <Link href='/inbox' className={styles.second}>{Inboxsvg('BIG')} Inbox</Link>
          <Link href='/notifications'>{NotificationSvg('BIG')} Notifications</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' type="text" name="search" placeholder='Search from title' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
          <NewFilterSets props={{
            id: 'filters',
            query: filters,
            class: styles.inView,
            clicked: styles.clicked,
            reset: ()=>setFilters(''),
            buttons: [
              {txt: 'Failed', reset: ()=>setFilters('failed'), query: 'failed'},
              {txt: 'Payments', reset: ()=>setFilters('payment'), query: 'payment'},
              {txt: 'Pending', reset: ()=>setFilters('pending'), query: 'pending'},
              {txt: 'Successful', reset: ()=>setFilters('successful'), query: 'successful'},
              {txt: 'Profile', reset: ()=>setFilters('profile'), query: 'profile'},
              {txt: 'Projects', reset: ()=>setFilters('project'), query: 'project'},
              {txt: 'Subscriptions', reset: ()=>setFilters('subscription'), query: 'subscription'},
            ]
          }} />
        </div>
        {isLoading && history.length < 1 && 
        <Defaultbg props={{
          styles: styles,
          img: '/homehero.png',
          h2: 'Getting history ...',
          text: 'Please be patient while we get your history',
        }}/>}
        {(!isLoading || history.length > 0) && Filter(filters)}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Backsvg()}</button>}
      </div>
      <Footer />
    </main>
  )
}

export default History
