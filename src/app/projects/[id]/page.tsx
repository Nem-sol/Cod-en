"use client"
import { Projects } from '@/types'
import React, { useEffect } from 'react'
import styles from './project.module.css'
import { useParams } from 'next/navigation'
import style from './../../main.module.css'
import { Defaultbg } from '@/src/components/pageParts'
import { useProjectContext } from '@/src/context/ProjectContext'
import { Devsvg, loaderCircleSvg, ProjectSvg, Refreshsvg } from '@/src/components/svgPack'

const Project = () => {
  const { id } = useParams()
  const { project , isLoading , error , setRefresh } = useProjectContext()
  const content = project.find((p: Projects) => p._id === id )
  
  useEffect(()=>{
    if ( !isLoading && project.length < 1 && error ) setRefresh(true)
  }, [])

  const IndividualProject = ({ project }: { project: Projects }) => {
    const { service , type , _id , about , features , paymentLevel } = project
    return <section>
      <div className={`${style.helps} ${styles.helps}`}>
        <span className={style.clicked}>{
            service === 'web application' ? Devsvg() :
            service === 'software application' ? Devsvg() :
            service === 'transcript' ? Devsvg() :
            service === 'upgrade' ? Devsvg() : 
            service === 'contract' ? Devsvg() : Devsvg()
          }{service}</span>
        <div className={styles.level}><p style={{ backgroundColor: paymentLevel < 30 ? 'var(--error)' : paymentLevel < 70 ? '#c88a18ff' : 'var(--success)'}}></p></div>
      </div>
    </section>
  }

  return (
    <main id={style.main}>
      <div className={style.main}>
        <h2 className={style.title}>{ProjectSvg()} {content?.name || 'Project details'}</h2>
        <div className={style.quick}>
        </div>
        {isLoading && !content && 
        <Defaultbg props={{
          styles: style,
          img: '/homehero.png',
          h2: 'Getting projects ...',
          text: 'Please be patient while we get your projects',
        }}/>}

        {project?.length < 1 && error && !isLoading && !content &&
          <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: 'Could not get projects',
            text: 'Try restoring internet connection or refreshing the page',
          }}/>}

        { project?.length < 1 && !error && !isLoading &&
          <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: `You have no projects`,
            text: 'Try restoring internet connection or refreshing the page',
          }}/>}

        { project?.length > 0 && !isLoading && !content &&
          <Defaultbg props={{
            styles: style,
            img: '/homehero.png',
            h2: `Project not found.`,
            text: 'This project does not exist in your portfolio',
          }}/>}

        { content && < IndividualProject project={content} />}
        {error && <button disabled={isLoading} className={style.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
    </main>
  )
}

export default Project
