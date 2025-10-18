'use client'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import React, { useState } from 'react'
import styles from '../../main.module.css'
import { useParams } from 'next/navigation'
import { FirstCase } from '@/src/components/functions'
import { Copier } from '../../../components/pageParts'
import { useHistoryContext } from '@/src/context/HistoryContext'
import { Backsvg, HistorySvg, Inboxsvg, loaderCircleSvg, NotificationSvg, Searchsvg } from '@/src/components/svgPack'

type History = {
  _id: string
  type: string
  class: string
  title: string
  target: string
  status: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
}
type HistoryPacks = {
  history: History
}

const HistoryPack = () => {
  const { id } = useParams()
  const ID = Number(id) || 12345
  const [ filter , setFilter ] = useState('')
  const { history, error, setRefresh, isLoading } = useHistoryContext()
  const content = history.find((h: History)=> h._id === id ) || history[ID]

  const searchParams = (txt: string) => {
    const splitTxt = filter ? txt.toLocaleLowerCase().split(filter.toLocaleLowerCase()) : [txt]
    const result: string | React.JSX.Element = txt.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ? filter ? <>{
      splitTxt.map(( t:string , i: number) => <>{i === 0 ? FirstCase(t) : t}{i < splitTxt.length - 1 && <span>{i === 0 && txt.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase()) ? FirstCase(filter) : filter}</span>}</>)
    }</> : txt : txt
    return result
  }

  function HistoryPacks({history}: HistoryPacks) {
    return (
      <div className={styles.hist_Pack}>
        <div className='flex font-medium justify-between gap-2.5 w-full text-[1.1em] px-7 text-[var(--deepSweetPurple)] mb-2.5'>{history.title}</div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Class: {searchParams(FirstCase(history.class))}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Day created: {searchParams(format(history.createdAt, "do MMMM, yyyy"))}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Id: {searchParams(history._id)}</p> <Copier props={{text: history._id}}/>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Status: {searchParams(history.status)}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Target: {searchParams(history.target)}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Time created: {searchParams(format(history.createdAt, 'h:mm a'))}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>Type: {searchParams(FirstCase(history.type))}</p>
        </div>
        <div className={styles.hist}  style={{alignItems: 'start', minHeight: '55px', justifyContent: 'space-between', flexDirection: 'row'}}>
          <p>{searchParams(history.message)}</p> <Copier props={{text: history.message}}/>
        </div>
      </div>
    )
  }
  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{HistorySvg()} History Detail</h2>
        <div className={styles.quick}>
          <Link href='/inbox' className={styles.second}>{Inboxsvg('BIG')} Inbox</Link>
          <Link href='/history'>{HistorySvg()} History</Link>
          <Link href='/notifications' className={styles.third}>{NotificationSvg('BIG')} Notifications</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' type="text" name="search" value={filter} placeholder='Search page details' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}/>
        </div>

        {!isLoading && history.length > 0 && !content && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty history feed'/></div>
          <h3 className='text-[var(--error)!important]'>History not found
          <p className='text-[var(--error)!important]'>This history may not exist. Verify history id and research</p></h3>
        </div>}

        {content && <HistoryPacks history={content}/>}

        {!isLoading && history.length < 1 && error && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty history feed'/></div>
          <h3>Could not get account history
          <p>Try restoring internet connection or refreshing the page</p></h3>
        </div>}

        {isLoading && history.length < 1 && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty notification feed'/></div>
          <h3>Getting history ...
          <p>Please be patient while we get your history</p></h3>
        </div>}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Backsvg()}</button>}
      </div>
    </main>
  )
}

export default HistoryPack
