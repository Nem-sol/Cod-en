'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './main.module.css'
import Footer from '../components/Footer'
import styles from './contact/page.module.css'
import { Back, HomeLink } from '../components/pageParts'
import { Helpsvg, HomeSvg } from '../components/svgPack'

const NotFound = () => {
  return (
    <main className={`flex flex-row justify-center items-center text-[var(--translucent)] ${style.main}`}>
      <div className={styles.background}></div>
      <div className='w-10/12 gap-y-2.5 gap-x-7 flex flex-row justify-center items-center flex-wrap content-center p-2.5 max-w-5xl'>
        <h2 className='w-full font-bold text-2xl text-center pt-8'>The page you&apos;re looking for could not be found</h2>
        <div className={styles.img}>
          <Image src='/homehero.png' fill={true} alt='page-not-found' />
        </div>
        <div className={styles.notFound + ' w-full flex gap-y-8 gap-x-1 justify-around max-w-80 flex-wrap font-medium text-[1.1em]'}>
          <p className='w-full text-center'>You might have entered a wrong url or clicked an expired button</p>
          <HomeLink>{HomeSvg()}<span>Home</span></HomeLink>
          <Link href='/help'>{Helpsvg()}<span>Help</span></Link>
          <Back />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default NotFound
