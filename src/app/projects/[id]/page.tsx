"use client"
import { Projects } from '@/types'
import style from './page.module.css'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import styles from './../../main.module.css'
import { Defaultbg } from '@/src/components/pageParts'
import { useProjectContext } from '@/src/context/ProjectContext'
import { loaderCircleSvg, ProjectSvg, Refreshsvg } from '@/src/components/svgPack'

const Project = () => {
  const { id } = useParams()
  const { project , isLoading , error , setRefresh } = useProjectContext()
  const content = project.find((p: Projects) => p._id === id )
  
  useEffect(()=>{
    if ( !isLoading && project.length < 1 && error ) setRefresh(true)
  }, [])

  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <h2 className={styles.title}>{ProjectSvg()} {content?.name || 'Project details'}</h2>
        <div className={styles.quick}>
        </div>
        {isLoading && !content && 
        <Defaultbg props={{
          styles: styles,
          img: '/homehero.png',
          h2: 'Getting projects ...',
          text: 'Please be patient while we get your projects',
        }}/>}

        {project?.length < 1 && error && !isLoading && !content &&
          <Defaultbg props={{
            styles: styles,
            img: '/homehero.png',
            h2: 'Could not get projects',
            text: 'Try restoring internet connection or refreshing the page',
          }}/>}

        { project?.length < 1 && !error && !isLoading &&
          <Defaultbg props={{
            styles: styles,
            img: '/homehero.png',
            h2: `You have no projects`,
            text: 'Try restoring internet connection or refreshing the page',
          }}/>}

        { project?.length > 0 && !isLoading && !content &&
          <Defaultbg props={{
            styles: styles,
            img: '/homehero.png',
            h2: `Project not found.`,
            text: 'This project does not exist in your portfolio',
          }}/>}
        {error && <button disabled={isLoading} className={styles.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg() : Refreshsvg()}</button>}
      </div>
    </main>
  )
}

export default Project
