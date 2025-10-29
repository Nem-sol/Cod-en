'use client'
import Link from 'next/link'
import style from './page.module.css'
import styles from '../main.module.css'
import React, { ReactNode } from 'react'
import Footer from '@/src/components/Footer'
import { DashboardSection } from '@/src/components/pageParts'
import { useProjectContext } from '@/src/context/ProjectContext'
import { Blogsvg, Booksvg, Buildsvg, Devsvg, Helpsvg, HomeSvg, Packssvg, Rocketsvg } from '@/src/components/svgPack'
import { useUserContext } from '@/src/context/UserProvider'

type Blogs = {
  props: { 
    link: string
    title: string;
    svg: ReactNode;
    address: string;
  }
}
type Summary = {
  props: { 
    summary: string | undefined
    jobStatus: string | undefined
  }
}

function DashboardBlogs({props}: Blogs){
  return(
    <section>
      {props.svg}
      {props.title}
      <Link href={props.address}>{props.link}</Link>
    </section>
  )
}

function DashboardSummary({props}: Summary){
  const { status } = useProjectContext()
  return(
    <div className='flex flex-col gap-y-2.5'>
      <span>Job status: <span className={props.jobStatus + ' font-medium'}>{status}</span></span>
      <div className={props.summary}></div>
    </div>
  )
}

const Dashboard = () => {
  const { userDetails: user } = useUserContext()
  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{HomeSvg()} Dashboard</h2>
        <div className={styles.quick}>
          <Link href='/help/routing'>{HomeSvg()} Know Environment</Link>
          <Link href='/projects/new' className={styles.second}>{Rocketsvg('isBig')} Create web project</Link>
          <Link href='/tutorial' className={styles.third}>{Devsvg()} Start Learning</Link>
          <Link href='/portfolio' className={styles.fourth}>{Buildsvg()} Connect with Cod-en</Link>
        </div>
        <DashboardSummary props={{
          summary: style.summary,
          jobStatus: style.jobstatus
        }}/>
        <div className="flex gap-y-5 flex-col">
          <p className={style.moderatortitle}>{Rocketsvg('BIG')} Getting Started</p>
          <div className={style.moderator}>
            <DashboardSection props={{
              class: true,
              id: 'backup',
              address: '/settings',
              active: style.active,
              title: 'Add backup email',
              moderator: style.moderator,
              condition: user && user.backupEmail,
              text: 'Secure your account for easy recovery and authentication with another email.'
            }}/>
            <DashboardSection props={{
              id: 'recov',
              address: '/settings',
              active: style.active,
              moderator: style.moderator,
              title: 'Add recovery questions',
              text: 'Create account security checks to prevent piracy hacks.',
              condition: user && user.recoveryQuestions?.length > 0,
            }}/>
            <DashboardSection props={{
              id: 'explore',
              address: '/tutorial',
              active: style.active,
              moderator: style.moderator,
              title: 'Get a tutorial pack',
              link: 'View tutorial catalogue',
              condition: user && user.exclusive,
              text: 'Check out all Learn-en courses we have for you and get one.'
            }}/>
            <DashboardSection props={{
              id: 'read',
              condition: true,
              address: '/help',
              active: style.active,
              link: 'Start Reading',
              moderator: style.moderator,
              title: 'Read Coden help manuals',
              text: 'Familiarize yourself with our website by getting answers to important questions from our help lists.'
            }}/>
          </div>
          <p className={style.moderatortitle}>{Blogsvg()} Coden Blogs</p>
          <div className={style.packs}>
            <DashboardBlogs props={{
              svg: Helpsvg(),
              title: "Starter's Guide",
              address: '/help/routing',
              link: 'A compiled breakdown of pages functions and tools in Cod-en',
            }}/>
            <DashboardBlogs props={{
              svg: Buildsvg(),
              title: 'Project Creation',
              address: '/help/create-project',
              link: 'Learn how to successfully create your project with Coden',
            }}/>
            <DashboardBlogs props={{
              svg: Packssvg('isBig'),
              title: 'Subscriptions',
              address: '/help/subscriptions',
              link: 'Boost your developer skills with flexible subscription patterns',
            }}/>
            <DashboardBlogs props={{
              svg: Devsvg(),
              title: 'Partners',
              address: '/portfolio/partners',
              link: 'See our works and completed client projects',
            }}/>
            <DashboardBlogs props={{
              svg: Devsvg(),
              title: 'Services',
              address: '/help/services',
              link: 'Crypto, Website Creation, Debugging, Code Editing, UX/ UI design',
            }}/>
            <DashboardBlogs props={{
              svg: Booksvg('BIG'),
              title: 'Privacy Policy',
              address: '/help/policy',
              link: 'Understand our mode of operation and content refrain system',
            }}/>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Dashboard
