'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../../main.module.css'
import { useParams } from 'next/navigation'
import Footer from '@/src/components/Footer'
import { useHelp } from '@/src/context/HelpProvider'
import { useUserContext } from '@/src/context/UserProvider'
import { Blogsvg, FolderSvg, Helpsvg, Refreshsvg, Searchsvg } from '@/src/components/svgPack'
import { CheckIncludes, classToggle, RemoveAllClass, RemoveOtherClass } from '@/src/components/functions'

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
  const { slug } = useParams()
  const [ filters, setFilters ] = useState('')
  const { userDetails: user} = useUserContext()
  const [ content , setContent ] = useState(null)
  const { help , error, setRefresh, isLoading } = useHelp()
  return (
    <main id={styles.main} className={!user ? 'pl-2.5' : ''}>
      <div className={styles.main}>
        <h2 className={styles.title}>{Helpsvg()} Help - {slug && (slug[0].toLocaleUpperCase() + slug.slice(1))}</h2>
        <div className={styles.quick}>
          <Link href='/blogs' className={styles.second}>{Blogsvg()} Blogs</Link>
          <Link href='/portfolio' className={styles.third}>{FolderSvg()} Portfolio</Link>
          <Link href='/help'>{Helpsvg()} Help</Link>
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
        {!isLoading && help.length > 0 && !content && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty help feed'/></div>
          <h3 className='text-[var(--error)!important]'>Help page not found
          <p className='text-[var(--error)!important]'>This help page may not exis, has been deleted or pushed to a new url</p></h3>
        </div>}

        

        {!isLoading && help.length < 1 && error && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty help feed'/></div>
          <h3>Could not get help page
          <p>Try restoring internet connection or refreshing the page</p></h3>
        </div>}

        {isLoading && help.length < 1 && <div className={styles.default_bg}>
          <div><Image src='/homehero.png' fill={true} alt='Empty notification feed'/></div>
          <h3>Loading help page...
          <p>Please be patient while we get your help</p></h3>
        </div>}
      </div>
      <Footer />
    </main>
  )
}

export default Help
