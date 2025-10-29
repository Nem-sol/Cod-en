'use client'
import Link from 'next/link'
import styles from '../main.module.css'
import React, { useState } from 'react'
import Footer from '@/src/components/Footer'
import { useProjectContext } from '@/src/context/ProjectContext'
import { Defaultbg, NewFilterSets } from '@/src/components/pageParts'
import { Inboxsvg, Linksvg, loaderCircleSvg, Moresvg, ProjectSvg, Refreshsvg, Rocketsvg, Searchsvg, SupportSvg } from '@/src/components/svgPack'

// type process = {
//   _id: string
//   title: string,
//   phase: {
//     type: string,
//     completed: boolean
//   }
// }

// type projct = {
//   _id: string
//   type: string
//   name: string
//   price: number
//   class: string
//   about: string
//   status: string
//   sector: string
//   userId: string
//   signed: boolean
//   concept: string
//   provider: string
//   createdAt: string
//   updatedAt: string
//   process: process[]
//   features: string[]
//   link: string | null
//   paymentLevel: number
// }

// type ProjectPack ={
//   project: projct
// }

type projct = {
  _id: string
  type: string
  class: string
  title: string
  target: string
  status: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
}
type ProjectPack = {
  project: projct
}

function ProjectPacks({project}: ProjectPack) {
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

  function Filter(filters: string){
    let result
    let filtered
    const filter = filters.toLocaleLowerCase()

    filtered = project

    if (!project) result = null
    else if (filter.trim() === '') filtered = project
    else if(filter === 'part' || filter === 'full') filtered = filtered.filter(( proj: projct )=> proj.type === filters)
    else if(filter === 'active' || filter === 'waiting' || filter === 'successful' || filter === 'terminated') filtered = filtered.filter(( proj: projct )=> proj.status.toLocaleLowerCase().includes(filter))
    else filtered = filtered.filter(( proj: projct )=> proj.title.toLocaleLowerCase().includes(filter))

    if (filtered && filtered.length > 0) result = filtered.map((proj: projct, i: number)=> <ProjectPacks key={i} project={proj}/>)

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
        {(!isLoading || project.length < 1) && Filter(filters)}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
      <Footer />
    </main>
  )
}

export default ProjectPack
