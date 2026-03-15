'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Helps } from '@/types'
import styles from '../../main.module.css'
import { useParams } from 'next/navigation'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { useHelp } from '@/src/context/HelpProvider'
import { useUserContext } from '@/src/context/UserProvider'
import { PortfolioSvg, Helpsvg } from '@/src/components/svgPack'
import { classToggle, RemoveOtherClass } from '@/src/components/functions'
import { FAQs, Resources, Routing , AddHelp } from './../HelpPagesHardCoded'


const Help = () => {
  const { slug: paramSlug } = useParams()
  const { userDetails: user} = useUserContext()
  const [ exists , setExists ] = useState(false)
  const { help , error, setRefresh, isLoading } = useHelp()
  
  const slug = String(paramSlug)
  const hardCodedPages = ['routing', 'faq' , 'new' , 'resources' ]
  
  useEffect(()=>{
    if (!slug || typeof slug !== 'string') return
    if ( user?.role !== 'admin' && slug === 'new' ) return
    if ( hardCodedPages.includes(slug)) setExists( true )
    else if ( !isLoading && help.length < 1 && !hardCodedPages.includes(slug) ) setRefresh(true)
  }, [])

  return (
    <main id={styles.main} className={!user ? 'pl-2.5' : ''}>
      <div className={styles.main}>
        <h2 className={styles.title}>{Helpsvg()} Help - {slug && (slug[0].toLocaleUpperCase() + slug.slice(1))}</h2>

        <div id={styles.searchbar}>
          <section className={styles.help}>
            <Link href='/portfolio' style={{ borderBottomLeftRadius: '3px' }}>{PortfolioSvg()} Portfolio</Link>
          </section>

          { help.length > 0 && (
            <menu id='filter'>
              <span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)', backgroundColor: 'var(--sweetRed) !important'}} onClick={()=>{classToggle('#filter', styles.inView); RemoveOtherClass('#filter', styles.inView, 'menu')}}>Helps</span>
              <div>
                {help.map(( h: Helps , i: number )=> <Link href={h.link} key={i}>{h.title}</Link>)}
              </div>
            </menu>
          )}
        </div>

        {!isLoading && help.length > 0 && !exists && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty help feed'/></div>
          <h3 className='text-[var(--error)!important]'>Help page not found
          <p className='text-[var(--error)!important]'>This help page may not exis, has been deleted or pushed to a new url</p></h3>
        </div>}

        {!isLoading && help.length < 1 && !exists && error && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty help feed'/></div>
          <h3>Could not get help page
          <p>Try restoring internet connection or refreshing the page</p></h3>
        </div>}

        {isLoading && help.length < 1 && !exists && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty notification feed'/></div>
          <h3>Loading help page...
          <p>Please be patient while we get you help</p></h3>
        </div>}

        { exists ? hardCodedPages.includes(slug) ? (
          slug === 'resources' ? <Resources /> : 
          slug === 'routing' ? <Routing /> : 
          slug === 'new' ? <AddHelp /> :  
          slug === 'faq' ? <FAQs /> : <></>
        ) : <></>
        : <></> }
      </div>
      <Footer />
    </main>
  )
}

export default Help
