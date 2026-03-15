'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Helps } from '@/types'
import style from './help.module.css'
import styles from '../main.module.css'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { useHelp } from '@/src/context/HelpProvider'
import { Blogsvg, Helpsvg, Locationsvg, PortfolioSvg, Refreshsvg, Searchsvg } from '@/src/components/svgPack'

const Help = () => {
  const [ filters, setFilters ] = useState('')
  const { help , error, setRefresh, isLoading } = useHelp()
  const hardCodedPages = ['routing', 'faq' , 'resources' ]
  
  useEffect(()=>{
    if ( !isLoading && help.length < 1 ) setRefresh(true)
  }, [])

  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{Helpsvg()} Help</h2>
        <div className={styles.quick}>
          <Link href='/blogs'>{Blogsvg()} Blogs</Link>
          <Link href='/portfolio' className={styles.third}>{PortfolioSvg()} Portfolio</Link>
          <Link href='/help/routing' className={styles.second}>{Locationsvg()} Page Routing</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' value={filters} type="text" name="search" placeholder='Search cod-en help' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
        </div>
        <section className="flex gap-2.5 my-auto flex-wrap justify-center">
            <div className={style.helpMap}>
              <div>
                { (!filters.trim() || 'faq'.includes(filters.trim())) && <Link href='/help/faq'>FAQs</Link>}
                { (!filters.trim() || 'routing'.includes(filters.trim())) && <Link href='/help/routing'>Routing</Link>}
                { (!filters.trim() || 'resources'.includes(filters.trim())) && <Link href='/help/resources'>Resources</Link>}
                { help.map(( h: Helps , i: number )=> !hardCodedPages.includes(h.slug) && ( !filters.trim() || h.title.includes(filters.trim())) && <Link href={`/help/${h.slug}`} key={i}>{h.title}</Link>) }
              </div>
            </div>
         
          <div className={styles.default_bg}>
            <div>
              <Image src={error ? '/network.png' : '/homehero.png'} fill={true} alt='Empty help feed'/></div>
              <h3 className={error ? 'text-[var(--error)!important]' : ''}>
                {!isLoading ? error ? 'Error occured'  : (filters.trim() !== '' && help.filter(( h: Helps )=> h.title.includes(filters.trim()))) ? 'Search term does not exist' : 'Search help titles' : 'Getting help pages ...'}
                <p>
                  {!isLoading ? error ? 'Could not get help pages' : filters.trim() !== '' && help.filter(( h: Helps )=> h.title.includes(filters.trim())).length < 1 ? 'Help title does not exist on Cod-en. Try researching titles' : 'Discover more on Cod-en from our help pages.' : 'Loading help pages data.'}
                </p>
                { error && !isLoading && <section className='pt-6 w-full'>
                <button className='flex gap-2.5 items-center justify-center rounded-[25px!important] mx-auto hover:bg-[#fc52524d]' style={{border: 'solid 2px', padding: '5px 23px', fontSize: '16px', color: 'var(--error)', borderColor: 'var(--error)', backgroundImage: 'linear-gradient( to right, #fc52524d, transparent'}} disabled={isLoading} onClick={()=>setRefresh(( prev : boolean)=> !prev)}>{Refreshsvg()} Refresh</button>
              </section>}
            </h3>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

export default Help
