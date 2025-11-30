'use client'
import { Projects } from '@/types';
import { useUserContext } from './UserProvider';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface ProjectSet {
  status: string
  error: boolean
  isLoading: boolean
  project: Projects[] | never[]
  setRefresh: Dispatch<SetStateAction<boolean>>
  setProject: Dispatch<SetStateAction< Projects[] | never[]>>
}

export const ProjectContext = createContext<ProjectSet | undefined >( undefined )

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ error, setError ] = useState(false)
  const [ status, setStatus ] = useState('Idle')
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ project, setProject ] = useState<Projects[] | never[]>([])

  useEffect(()=>{
    const fetchProject = async () =>{
      setError(false)
      setIsLoading(true)
      try {
        const res = await fetch('/api/projects/', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user?.id}`,
          }
        });
        const result = await res.json()
        !res.ok && setError(true)
        res.ok && setProject(result)
      } catch (error) {
        setError(true)
        console.log('Failed to fetch projects', error)
      }
      setIsLoading(false)
    }
    user ? fetchProject() : setProject([])
    project.length > 0 ? setStatus(project.filter(( proj: Projects )=> proj.status !== 'failed' && proj.status !== 'complete')[0].status) : setStatus('Idle')
  }, [ user , refresh ])

  return(
    <ProjectContext.Provider value={{project, status, setProject, isLoading, setRefresh, error}}>
      { children }
    </ProjectContext.Provider>
  )
}

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  
  if (!context) throw new Error('useProjectContext must be used within an EmailProvider');
  
  return context;
}