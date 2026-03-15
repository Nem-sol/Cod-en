'use client'
import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import main from '../../main.module.css'
import home from '../../page.module.css'
import Footer from '@/src/components/Footer'
import style from './../socials/page.module.css'
import { Devsvg, Helpsvg } from '@/src/components/svgPack'
import stylez from './../../recovery/page.module.css'
import { PortfolioServiceNavButton, ProjectFeeds, ProjectVid } from '@/src/components/pageParts'

const PortfolioProjects = () => {

  return (
    <main id={main.main}>
      <div className={home.background} style={{boxShadow: '0px 1px 14px rgba(0, 0, 0, 0.28), 0px 3px 10px rgba(0, 0, 0, 0.2)'}}></div>
    <div className={main.main} style={{ maxWidth: '1175px', paddingTop: '50px' }}>
        <h2 className={style.h2}> Cod-en Projects </h2>
        <div className={styles.pack}>
          <section className={style.nav}>
          <PortfolioServiceNavButton  styles={style}/>
            <section className='p-3 w-[175px]'>
              <Link href='/portfolio'><span></span> Home</Link>
              <Link href='/portfolio/socials'><span></span> Socials</Link>
              <Link href='/portfolio/services'><span></span> Services</Link>
              <Link href='/portfolio/projects'><span></span> Projects</Link>
              <Link href='/portfolio/languages'><span></span> Languages</Link>
            </section>
          </section>
          <ProjectVid styles={styles}/>
          <ProjectFeeds styles={styles} style={stylez} home={main} />
          <div className='flex gap-2.5 flex-wrap'>
            <Link href='/portfolio/languages' className={styles.a}>View cod-en languages {Devsvg()}</Link>
            <Link href='/help/project' className={styles.a}>Cod-en project system{Helpsvg()}</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default PortfolioProjects
