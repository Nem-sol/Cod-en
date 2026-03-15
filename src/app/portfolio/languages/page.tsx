import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import main from '../../main.module.css'
import home from '../../page.module.css'
import Footer from '@/src/components/Footer'
import socials from './../socials/page.module.css'
import { Language , PortfolioLanguages , PortfolioServiceNavButton } from '@/src/components/pageParts'
import { Feedbacksvg, loaderCircleSvg, Nextsvg, Nodesvg, Reactsvg , BigBookSvg } from '@/src/components/svgPack'

const Page = () => {
  return (
    <main id={main.main}>
      <div className={main.main} style={{ containerType: 'inline-size' }}>
        <h2 className={styles.title}> Cod-en Languages </h2>
        <section className={socials.nav}>
          <PortfolioServiceNavButton  styles={socials}/>
          <section className='p-3 w-[175px]' style={{fontSize: '1.1em'}}> 
              <Link href='/portfolio'><span></span> Home</Link> 
              <Link href='/portfolio/socials'><span></span> Socials</Link> 
              <Link href='/portfolio/services'><span></span> Services</Link> 
              <Link href='/portfolio/projects'><span></span> Projects</Link> 
              <Link href='/portfolio/languages'><span></span> Languages</Link>
          </section>
        </section>
        <section className={styles.holders}><section className='p-2.5 flex gap-2.5 flex-col text-[17px]'>
          <h2 className='flex gap-2.5 items-center'>
            What do we know? {Feedbacksvg('min-w-7 min-h-7')}
          </h2>
          We are experienced with a wide range of programming frameworks, libraries, and languages, and we remain committed to continuous learning and improvement.
          <p>
            View our works. <Link href='/portfolio/projects' className='text-[var(--deepSweetPurple)]'> Cod-en projects</Link>
          </p>
          <PortfolioLanguages styles={styles} />
        </section>

        <section className='p-2.5 flex gap-2.5 flex-col text-[17px]'>
          <h2 className='flex gap-2.5 items-center'>
            Why do we learn? {Feedbacksvg('min-w-7 min-h-7')}
          </h2>
          At Cod-en, we prioritize continuous improvement to meet our clients’ goals in both functionality and user experience, while staying aligned with current and emerging trends in the tech industry.
          <p>
            Below is a list of the programming frameworks and libraries we work with.
          </p>
        </section>
          <menu>
            <p className={styles.p}><span>{Nextsvg()} Next.js </span></p>
            <p><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a> is a production-ready React framework developed by Vercel.</p>
            <p>It enables developers to build modern web applications with features such as server-side rendering, static site generation, file-based routing, API routes, and automatic performance optimizations.</p>
            <p>With Next.js, applications load faster, scale better, and offer improved SEO and user experience out of the box.</p>
            <section style={{ zIndex: '0'}} className='flex justify-center'>
              <section className={styles.coden}>
                <section>
                  <menu className={styles.background}></menu>
                  <span>{loaderCircleSvg()} Loading Cod-en...</span>
                </section>
              </section>
            </section>
          </menu>
          <menu>
            <p className={styles.p}><span>{Reactsvg()} React </span></p>
            <p><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a> is a JavaScript library developed by Meta for building interactive user interfaces.</p>
            <p>It uses a component-based architecture and a virtual DOM to efficiently render and update views, making it ideal for building dynamic, scalable web applications.</p>
            <section style={{ zIndex: '0'}} className='flex justify-center'>
              <Language props={home}/>
            </section>
          </menu>
          <menu>
            <p className={styles.p}><span>{Nodesvg()} Node.js </span></p>
            <p><a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Next.js</a> is an open-source JavaScript runtime built on Chrome’s V8 engine.</p>
            <p>It enables developers to build server-side applications using JavaScript, with a non-blocking, event-driven architecture designed for performance and scalability.</p>
            <section style={{ zIndex: '0'}} className='flex justify-center'>
            </section>
          </menu>
          <section className={styles['attribution-card']}>
            <div className={styles['card-header']}>
              <div className={styles['icon-wrapper']}>{BigBookSvg()}</div>
              <h2>Development Libraries</h2>
            </div>
            <div className={styles['libraries-grid']}>
              <div className={styles['library-category']}>
                <h4>Frontend</h4>
                <ul>
                  <li><span>React</span><span>MIT</span></li>
                  <li><span>Next.js</span><span>MIT</span></li>
                  <li><span>CSS</span><span>Standard</span></li>
                  <li><span>Tailwind CSS</span><span>MIT</span></li>
                  <li><span>Axios</span><span>MIT</span></li>
                  <li><span>Socket.IO Client</span><span>MIT</span></li>
                </ul>
              </div>

              <div className={styles['library-category']}>
                <h4>Backend</h4>
                <ul>
                  <li><span>Express.js</span><span>MIT</span></li>
                  <li><span>Mongoose</span><span>MIT</span></li>
                  <li><span>Prisma (postgreSQL) </span><span>MIT</span></li>
                  <li><span>Next.js</span><span>MIT</span></li>
                  <li><span>Socket.IO</span><span>MIT</span></li>
                  <li><span>jsonwebtoken (JWT)</span><span>MIT</span></li>
                  <li><span>Nodemailer</span><span>MIT</span></li>
                </ul>
              </div>

              <div className={styles['library-category']}>
                <h4>Authentication</h4>
                <ul>
                  <li><span>Google OAuth</span><span>Proprietary</span></li>
                  <li><span>Twitter (X) OAuth 2.0</span><span>Proprietary</span></li>
                  <li><span>NextAuth.js</span><span>MIT</span></li>
                  <li><span>bcrypt</span><span>MIT</span></li>
                  <li><span>validator</span><span>MIT</span></li>
                </ul>
              </div>

              <div className={styles['library-category']}>
                <h4>Languages</h4>
                <ul>
                  <li><span>TypeScript</span><span>Apache 2.0</span></li>
                  <li><span>JavaScript</span><span>Standard</span></li>
                  <li><span>HTML</span><span>Standard</span></li>
                </ul>
              </div>

              <div className={styles['library-category']}>
                <h4>Utilities</h4>
                <ul>
                  <li><span>date-fns</span><span>MIT</span></li>
                  <li><span>Recharts</span><span>MIT</span></li>
                  <li><span>NProgress</span><span>MIT</span></li>
                </ul>
              </div>

            </div>
            <p style={{ color: 'rgb(79 70 229)' , alignSelf: 'end' }}> ... and more to come soon.</p>
          </section>
        </section>
      </div>
      <Footer />
    </main>
  )
}

export default Page
