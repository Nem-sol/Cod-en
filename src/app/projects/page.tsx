'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Projects } from '@/types'
import style from './page.module.css'
import styles from '../main.module.css'
import Footer from '@/src/components/Footer'
import React, { useEffect, useState } from 'react'
import { FirstCase } from '@/src/components/functions'
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
        {project.reason && <p>{project.reason}</p>}
        <p><span>{date}</span> <span className={style[project.status]}>{project.status}</span></p>
        <span className={`${style.signed} ${project.signed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}> <svg ></svg>{project.signed ? 'Signed' : 'Not signed'}</span>
        <p style={{gap: '10px', justifyContent: 'flex-end'}}>{provider === 'github' ? Githubsvg('BIG') : provider === 'domain'  && Cloudsvg()}{FirstCase(provider)}</p>
      </div>
      <p style={{justifyContent: 'flex-end'}}>
        <Link href={'/project/'+project._id}>{Linksvg()}</Link>
        <Link href={"/payments/"+project._id} className={style.pay}> {TagSvg('p-0.5')} Make payment</Link>
      </p>
    </div>
  )
}

const ProjectPack = () => {
  const [ filters, setFilters ] = useState('')
  const { project, error, setRefresh, isLoading } = useProjectContext()

  function Filter(filters: string){
    let result
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = project

    if (!project) result = null
    else if (filter.trim() === '') filtered = project
    else if(filter === 'part' || filter === 'full') filtered = filtered.filter(( proj: Projects )=> proj.type === filters)
    else if(filter === 'active' || filter === 'waiting' || filter === 'successful' || filter === 'terminated') filtered = filtered.filter(( proj: Projects )=> proj.status.toLocaleLowerCase().includes(filter))
    else filtered = filtered.filter(( proj: Projects )=> proj.name.toLocaleLowerCase().includes(filter))

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
        h2: `You have no ${filter.trim() !== '' ? 'matching' : 'account'} project`,
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
              {txt: 'Active', reset: ()=>setFilters('active'), query: 'active'},
              {txt: 'Full projects', reset: ()=>setFilters('full'), query: 'full'},
              {txt: 'Part projects', reset: ()=>setFilters('part'), query: 'part'},
              {txt: 'Waiting', reset: ()=>setFilters('waiting'), query: 'waiting'},
              {txt: 'Successful', reset: ()=>setFilters('successful'), query: 'successful'},
              {txt: 'Terminated', reset: ()=>setFilters('terminated'), query: 'terminated'},
            ]
          }} />
        </div>
        {isLoading && project.length < 1 && 
        <Defaultbg props={{
          styles: styles,
          img: '/homehero.png',
          h2: 'Getting projects ...',
          text: 'Please be patient while we get your projects',
        }}/>}
        {(!isLoading || project.length > 0) && Filter(filters)}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
      <Footer />
    </main>
  )
}

export default ProjectPack
