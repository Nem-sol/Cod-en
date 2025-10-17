'use client'
import Link from 'next/link'
import styles from '../main.module.css'
import React, { useState } from 'react'
import { useProjectContext } from '@/src/context/ProjectContext'
import { Defaultbg, NewFilterSets } from '@/src/components/pageParts'
import { CheckIncludes, RemoveAllClass, } from '@/src/components/functions'
import { AddProjectsvg, Inboxsvg, Linksvg, loaderCircleSvg, Moresvg, ProjectSvg, Refreshsvg, Searchsvg, SupportSvg } from '@/src/components/svgPack'


function ProjectPacks({project}: any) {
  const date = project.createdAt
  return (
    <div  className={project.status + styles.hist} id={project._id}>
      <div>
        <p>{date}</p>
        <p>{project.title}</p>
        <p>{project.target}</p>
        <p>{project.status}</p>
      </div>
      <div>
        <Link href={'/project/'+project._id}>{Linksvg()}</Link>
        <button>{Moresvg()}</button>
      </div>
    </div>
  )
}

const ProjectPack = () => {
  const [ filters, setFilters ] = useState('')
  const { project, error, setRefresh, isLoading } = useProjectContext()

  function Filter(filters :  string){
    let result
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = project

    if (!project) result = null
    else if (filter.trim() === '') filtered = project
    else if(filter === 'part' || filter === 'full') filtered = filtered.filter(( proj: any )=> proj.type === false)
    else if(filter === 'active' || filter === 'waiting' || filter === 'successful' || filter === 'terminated') filtered = filtered.filter(( proj: any )=> proj.status.toLocaleLowerCase().includes(filter))
    else filtered = filtered.filter(( proj: any )=> proj.title.toLocaleLowerCase().includes(filter))

    if (filtered && filtered.length > 0) result = filtered.map((proj: any, i: number)=> <ProjectPacks key={i} project={proj}/>)

    if (project && project.length < 1 && error ) return (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: 'Could not get projects',
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
    else return result ? (
      <div className={styles.noti}>
        {result}
      </div>) : (
      <Defaultbg props={{
        styles: styles,
        img: '/homehero.png',
        h2: `You have no ${filter.trim() !== '' ? 'matching' : 'account'} project`,
        text: 'Try restoring internet connection or refreshing the page',
      }}/>)
  }

  return (
    <main id={styles.main} onClick={( e: any)=> !CheckIncludes(e, 'menu') && !CheckIncludes(e, 'menu div') && !CheckIncludes(e, 'menu button') && !CheckIncludes(e, 'menu span') && RemoveAllClass( styles.inView , 'menu' )}>
      <div className={styles.main}>
        <h2 className={styles.title}>{ProjectSvg()} Projects</h2>
        <div className={styles.quick}>
          <Link href='/projects/new'>{AddProjectsvg()} Create new project</Link>
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
        {(!isLoading || project.length < 1) && Filter(filters)}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: Boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
    </main>
  )
}

export default ProjectPack
