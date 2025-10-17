'use client'
import { useSocket } from './SocketContext';
import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from './UserProvider';

export const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const { socket, ready } = useSocket()
  const [ error, setError ] = useState(false)
  const [ project, setProject ] = useState([])
  const [ status, setStatus ] = useState('Idle')
  const { userDetails: user } = useUserContext()
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(()=>{
    const fetchProject = async () =>{
      setError(false)
      setIsLoading(true)
      try {
        const res = await fetch('/api/projects/', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${user.id}`,
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
    project.length > 0 ? setStatus(project.filter( proj => proj.status !== 'failed' && proj.status !== 'complete')[0].status) : setStatus('Idle')
  }, [ user , refresh ])

  useEffect(()=>{
    if (!ready) return
    socket.on('project-updated', (updated)=> {
      setProject((prev) => prev.map( p => p._id === updated._id ? updated : p))
    })

    return () => socket.off('project-updated')
  }, [ socket ])

  return(
    <ProjectContext.Provider value={{project, status, setProject, isLoading, setRefresh, error}}>
      { children }
    </ProjectContext.Provider>
  )
}

export const useProjectContext = () => useContext(ProjectContext)