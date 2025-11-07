import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/src/components/Footer'
import styles from '../../.././contact/page.module.css'
import { Helpsvg } from '../../../../components/svgPack'
import { Back, LogLink } from '@/src/components/pageParts'

const Page = () => {
  return (
    <main className='flex flex-row justify-center items-center place-self-center' style={{color: 'var(--error)'}}>
      <div className={styles.background}></div>
      <div className='w-10/12 gap-y-2.5 gap-x-7 flex flex-row justify-center items-center flex-wrap content-center p-2.5 max-w-5xl'>
        <h2 className='w-full font-bold text-2xl text-center pt-8'>OAuth attempt failed</h2>
        <div className={styles.img}>
          <Image src='/homehero.png' fill={true} alt='page-not-found' />
        </div>
        <div className={styles.notFound + ' w-full flex gap-y-8 gap-x-1 justify-around max-w-80 flex-wrap font-medium'} style={{fontSize: '1.1em'}}>
          <p className='w-full text-center'>This may be due to unstable internet connection, wrong url-entry or aborted verification.</p>
          <Back />
          <Link href='/help'>{Helpsvg()}<span>Help</span></Link>
          <LogLink />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Page
