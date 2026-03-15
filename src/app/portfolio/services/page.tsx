import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import main from '../../main.module.css'
import home from '../../page.module.css'
import Footer from '@/src/components/Footer'
import socials from './../socials/page.module.css'
import { PortfolioServiceBanners, PortfolioServiceLink, PortfolioServiceNavButton } from '@/src/components/pageParts'
import { AppSvg, Bugsvg, Devsvg, GlobeSvg, HandShakeSvg, ResourcesSvg } from '@/src/components/svgPack'

const Page = () => {

  const ServicePack = ({ svg = <></> , callup = '' , text= '' }) => {
    return (
      <section className={styles.calls}>
        { svg }
        <h2>{callup}</h2>
        <p>{text}</p>
      </section>
    )
  }

  return (
    <main id={main.main}>
      <div className={home.background}></div>
      <div className={main.main}  style={{ gap: '70px' , containerType: 'inline-size' }}>
        <h2 className={styles.title}> Cod-en Services </h2>
        <section className={socials.nav} style={{fontSize: '1.1em'}}>
          <PortfolioServiceNavButton  styles={socials}/>
          <section className='p-3 w-[175px]'>
            <Link href='/portfolio'><span></span> Home</Link>
            <Link href='/portfolio/socials'><span></span> Socials</Link>
            <Link href='/portfolio/services'><span></span> Services</Link>
            <Link href='/portfolio/projects'><span></span> Projects</Link>
            <Link href='/portfolio/languages'><span></span> Languages</Link>
          </section>
        </section>
        <section className={styles.h2}>
          <h2>Service scopes</h2>
        </section>
        <section className={styles['calls-holder']}>
          <ServicePack svg={Devsvg()} callup='Transcript' text='Change code framework and language'/>
          <ServicePack svg={GlobeSvg()} callup='Web Applications' text='Create a project accessibe globally on a web browser'/>
          <ServicePack svg={HandShakeSvg()} callup='Contracts' text='Create a long-term service account with Cod-en'/>
          <ServicePack svg={Bugsvg()} callup='QA testing' text='Debug your code for efficiency'/>
          <ServicePack svg={AppSvg()} callup='Software application' text='Create your project as a software program'/>
          <ServicePack svg={ResourcesSvg()} callup='Upgrades' text='Add important features to your code with integratable component parts'/>
          <div className='w-full'><PortfolioServiceLink /></div>
        </section>
        <PortfolioServiceBanners styles={styles} />
        <div className={styles.cta}><h3>Need More Help?</h3><p>Explore our other documentation sections for detailed guides and service citings</p><div className={styles.links}>
          <Link href="/portfolio/projects" >Cod-en projects</Link>
          <Link href="/help/faq" >FAQs</Link>
          <Link href="/help/projects" >Project policy</Link>
          <Link href="/help/terms" >Privacy &amp; Terms</Link></div></div>
      </div>
      <Footer />
    </main>
  )
}

export default Page
