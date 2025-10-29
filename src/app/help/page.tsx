'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../main.module.css'
import Footer from '@/src/components/Footer'
import { useHelp } from '@/src/context/HelpProvider'
import { classToggle, RemoveOtherClass } from '@/src/components/functions'
import { Blogsvg, FolderSvg, Helpsvg, Locationsvg, Refreshsvg, Searchsvg } from '@/src/components/svgPack'

type Help = {
  _id: string
  link: string
  slug: string
  title: string
  content: string
  related: string[]
  createdAt: string | null
  updatedAt: string | null
}

const Help = () => {
  const [ filters, setFilters ] = useState('')
  const { help , error, setRefresh, isLoading } = useHelp()
  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{Helpsvg()} Help</h2>
        <div className={styles.quick}>
          <Link href='/blogs' className={styles.second}>{Blogsvg()} Blogs</Link>
          <Link href='/portfolio'>{FolderSvg()} Portfolio</Link>
          <Link href='/help/routing' className={styles.third}>{Locationsvg()} Page Routing</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' value={filters} type="text" name="search" placeholder='Search cod-en help' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
          {help.length > 0 && (
            <menu id='filter'>
              <span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)', backgroundColor: 'var(--sweetRed) !important'}} onClick={()=>{classToggle('#filter', styles.inView); RemoveOtherClass('#filter', styles.inView, 'menu')}}>Helps</span>
              <div>
                {help.map(( h: Help , i: number )=> <Link href={h.link} key={i}>{h.title}</Link>)}
              </div>
            </menu>
          )}
        </div>
        <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty help feed'/></div>
          <h3 className={error && 'text-[var(--error)!important]'}>{!isLoading ? error ? 'Error occured'  : (filters.trim() !== '' && help.filter(( h: Help )=> h.title.includes(filters.trim()))) ? 'Search term does not exist' : 'Search help titles' : 'Getting help pages ...'}
          <p>{!isLoading ? error ? 'Could not get help pages' : (filters.trim() !== '' && help.filter(( h:Help )=> h.title.includes(filters.trim()))) ? 'Help title does not exist on Cod-en. Try researching titles' : 'Discover more on Cod-en from our help pages.' : 'Loading help pages data.'}</p></h3>
          {(error || isLoading) && <section className='pt-6 w-full'><button className='flex gap-2.5 items-center justify-center rounded-[25px!important] mx-auto hover:bg-[#fc52524d]' style={{border: 'solid 2px', padding: '5px 23px', fontSize: '16px', color: 'var(--error)', borderColor: 'var(--error)', backgroundImage: 'linear-gradient( to right, #fc52524d, transparent'}} disabled={isLoading} onClick={()=>setRefresh(( prev : boolean)=> !prev)}>{Refreshsvg()} Refresh</button></section>}
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Help
