import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import main from '../../main.module.css'
import Footer from '@/src/components/Footer'
import { emails } from '@/src/utils/apiTools'
import { Facebooksvg, Githubsvg, Mailsvg, SupportSvg, Xsvg, Youtubesvg } from '@/src/components/svgPack'
import { MediaCaptions, PortfolioServiceNavButton } from '@/src/components/pageParts'

type socialLink = {
  link: string
  svg: React.ReactNode
}

const page = () => {
  const LinkPack = ({ svg, link }: socialLink ) => <a href={ link }> {svg} </a>

  return (
    <>
      <main id={main.main}>
        <div className={main.main} style={{ gap: '10px', maxWidth: '1175px', paddingTop: '50px' }}>
          <h2 className={styles.h2}> Cod-en Socials </h2>
          <div className={styles.links}>
            <LinkPack svg={Youtubesvg('BIG')} link='https://youtube.com' />
            <LinkPack svg={Facebooksvg()} link='https://facebook.com' />
            <LinkPack svg={Xsvg('p-1')} link='https://x.com' />
            <LinkPack svg={Youtubesvg('BIG')} link='https://youtube.com' />
            <LinkPack svg={Facebooksvg()} link='https://facebook.com' />
            <LinkPack svg={Xsvg('p-1')} link='https://x.com' />
            <LinkPack link="https://github.com" svg={Githubsvg()} />
            <LinkPack link={`mailto:${emails}`} svg={Mailsvg()} />
            <Link href="/contact">{SupportSvg()}</Link>
          </div>
          <div id={styles.default_bg} className={main.default_bg} style={{ width: '90%', maxWidth: '1200px', flexDirection: 'column' }}>
            <section className={styles.media}>
              <section className={styles.nav}>
                <PortfolioServiceNavButton  styles={styles}/>
                <section className='p-3 w-[175px]'>
                  <Link href='/portfolio'><span></span> Home</Link>
                  <Link href='/portfolio/socials'><span></span> Socials</Link>
                  <Link href='/portfolio/services'><span></span> Services</Link>
                  <Link href='/portfolio/projects'><span></span> Projects</Link>
                  <Link href='/portfolio/languages'><span></span> Languages</Link>
                </section>
              </section>
              <h2 className={styles.title}>
                Connect with Cod-en+
                <MediaCaptions />
              </h2>
            </section>
            <div style={{maxWidth: '500px', minWidth: '250px'}}>
              <video autoPlay muted loop playsInline >
                <source src="/socials.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        <Footer />
      </main>
      <div className={styles.bottom_bg}></div>
    </>
  )
}

export default page
