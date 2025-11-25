'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Projects } from '@/types'
import style from './page.module.css'
import styles from '../main.module.css'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { FirstCase, RemoveLikeClass, Toggle } from '@/src/components/functions'
import { useProjectContext } from '@/src/context/ProjectContext'
import { Defaultbg, NewFilterSets } from '@/src/components/pageParts'
import { Cloudsvg, Githubsvg, Inboxsvg, Linksvg, loaderCircleSvg, ProjectSvg, Refreshsvg, Rocketsvg, Searchsvg, SupportSvg, TagSvg } from '@/src/components/svgPack'

function ProjectPacks({project}: {project: Projects}) {
  const provider = project.provider
  const date = format(project.createdAt, 'do MMMM, yyyy')
  return (
    <div className={style.project}>
      <div>
        <h2>
          <span>{project.name}</span>
          <span style={{fontSize: '15px', fontWeight: 600}}>{project.sector}</span>
        </h2>
        <p>{FirstCase(project.service)}</p>
        {project.reason && <p className={style[project.status]}>{project.reason}</p>}
        <p><span>{date}</span> <span className={style[project.status]}>{project.status}</span></p>
        <span className={`${style.signed} ${project.signed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}> <svg ></svg>{project.signed ? 'Signed' : 'Not signed'}</span>
        <p style={{gap: '10px', justifyContent: 'flex-end'}}>{provider === 'github' ? Githubsvg('BIG') : provider === 'domain'  && Cloudsvg()}{FirstCase(provider)}</p>
      </div>
      <p style={{justifyContent: 'flex-end'}}>
        <Link href={'/projects/'+project._id}>{Linksvg()}</Link>
        <Link href={"/payments/"+project._id} className={style.pay}> {TagSvg('p-0.5')} Make payment</Link>
      </p>
    </div>
  )
}

const ProjectPack = () => {
  const [ check, setFilter ] = useState('')
  const [ filters, setFilters ] = useState('')
  const { project, error, setRefresh, isLoading } = useProjectContext()

  function Filter(filters: string , check: string ){
    let result
    let filtered
    const sub = check.toLocaleLowerCase()
    const filter = filters.toLocaleLowerCase()

    filtered = project

    if (!project) result = null
    else if (filter.trim() === '') filtered = project
    else if(filter === 'part' || filter === 'full') filtered = filtered.filter(( proj: Projects )=> proj.type === filters)
    else if(filter === 'software' || filter === 'web' || filter === 'transcript' || filter === 'upgrade' || filter === 'contract' || filter === 'q a testing' ) filtered = filtered.filter(( proj: Projects )=> proj.service.toLocaleLowerCase().includes(filter))
    else filtered = filtered.filter(( proj: Projects )=> proj.name.toLocaleLowerCase().includes(filter))

    if ( sub && sub !== 'not' ) filtered = filtered.filter(( proj: Projects ) => proj.status.toLocaleLowerCase().includes(sub))

    if (filtered && filtered.length > 0) result = filtered.map((proj: Projects, i: number)=> <ProjectPacks key={i} project={proj}/>)

    if (project && project.length < 1 && error ) return (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: 'Could not get projects',
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
    else return result ? result : (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: `You have no ${ ( filter.trim() !== '' || sub.trim() !== '') ? 'matching' : 'account'} project`,
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
  }

  useEffect(()=>{
    if ( !isLoading && project.length < 1 && error ) setRefresh(true)
  }, [])

  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{ProjectSvg()} Projects</h2>
        <div className={styles.quick}>
          <Link href='/projects/new'>{Rocketsvg('BIG')} Create new project</Link>
          <Link href='/contact' className={styles.second}>{SupportSvg('max-w-[22]')} Contact us</Link>
          <Link href='/inbox' className={styles.third}>{Inboxsvg('BIG')} Inbox</Link>
        </div>
        <div id={styles.searchbar}>
          <span>{Searchsvg()}</span>
          <input autoComplete='true' type="text" name="project" placeholder='Search projects by title' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFilters(e.target.value)}/>
          <NewFilterSets props={{
            id: 'filters',
            query: filters,
            class: styles.inView,
            clicked: styles.clicked,
            reset: ()=>setFilters(''),
            buttons: [
              {txt: 'Full projects', reset: ()=>setFilters('full'), query: 'full'},
              {txt: 'Part projects', reset: ()=>setFilters('part'), query: 'part'},
              {txt: 'Web application', reset: ()=>setFilters('web'), query: 'web'},
              {txt: 'Software applications', reset: ()=>setFilters('software'), query: 'software'},
              {txt: 'Transcript', reset: ()=>setFilters('transcript'), query: 'transcript'},
              {txt: 'Upgrades', reset: ()=>setFilters('upgrade'), query: 'upgrade'},
              {txt: 'Contracts', reset: ()=>setFilters('contract'), query: 'contract'},
              {txt: 'Quality assurance', reset: ()=>setFilters('Q A testing'), query: 'Q A testing'},
            ]
          }} />
        </div>
        <div className={styles.helps}>
          <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'active' ? '' : 'active' ); Toggle( e , styles.clicked ); RemoveLikeClass(e, styles.clicked , `.${styles.helps} span`)}}>Active</span>
          <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'waiting' ? '' : 'waiting' ); Toggle( e , styles.clicked ); RemoveLikeClass(e, styles.clicked , `.${styles.helps} span`)}}>Waiting</span>
          <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'complete' ? '' : 'complete' ); Toggle( e , styles.clicked ); RemoveLikeClass(e, styles.clicked , `.${styles.helps} span`)}}>Completed</span>
          <span onClick={(e: React.MouseEvent<HTMLSpanElement>)=>{setFilter((prev: string) => prev === 'terminated' ? '' : 'terminated' ); Toggle( e , styles.clicked ); RemoveLikeClass(e, styles.clicked , `.${styles.helps} span`)}}>Terminated</span>
        </div>
        {isLoading && project.length < 1 && 
        <Defaultbg props={{
          styles: styles,
          img: '/homehero.png',
          h2: 'Getting projects ...',
          text: 'Please be patient while we get your projects',
        }}/>}
        {(!isLoading || project.length > 0) && Filter( filters , check )}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
      <Footer />
    </main>
  )
}

export default ProjectPack
