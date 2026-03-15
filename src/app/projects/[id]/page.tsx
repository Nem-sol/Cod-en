"use client"
import Link from 'next/link'
import { format } from 'date-fns'
import styles from './project.module.css'
import home from './../../page.module.css'
import { useParams } from 'next/navigation'
import style from './../../main.module.css'
import Footer from '@/src/components/Footer'
import { Phase, Process, Projects } from '@/types'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/src/context/ThemeContext'
import { FirstCase } from '@/src/components/functions'
import { useSocket } from '@/src/context/SocketContext'
import { EdittablePack } from '@/src/components/ChatBox'
import { useUserContext } from '@/src/context/UserProvider'
import { Defaultbg, Notify } from '@/src/components/pageParts'
import { useProjectContext } from '@/src/context/ProjectContext'
import { AppSvg, BigBookSvg, Booksvg, Bugsvg, Devsvg, Feedbacksvg, Githubsvg, GlobeSvg, HandShakeSvg, HistorySvg, Infosvg, Linksvg, loaderCircleSvg, MenuShortSvg, ProjectSvg, Refreshsvg, ResourcesSvg, ShuffleSvg, SupportSvg, Searchsvg, UnlockSvg, Vercelsvg, DeleteSvg, ShortPayStackSvg, TagSvg, SettingSvg, Locationsvg, AddSvg, MinusSvg, checkmarkSvg, Rocketsvg } from '@/src/components/svgPack'

const Project = () => {
  const { id } = useParams()
  const { mode } = useTheme()
  const { socket , ready } = useSocket()
  const { userDetails: user } = useUserContext()
  const { project , isLoading , error , setRefresh } = useProjectContext()
  const content = project.find((p: Projects) => p._id === id || p.name === id )
  
  useEffect(()=>{
    if ( !isLoading && project.length < 1 && error ) setRefresh(true)
  }, [])

  const ProjectProcess = () => {
    if (!content) return <></>

    const { process , service } = content
    const [ loading , setLoading ] = useState( false )
    const [ editting , setEditting ] = useState( false )
    const [ processError , setProcessError ] = useState('')
    const [ processProj , setProcess ] = useState( process )
    const [ showProcess , setShownProcess ] = useState( process )

    const getColor = ( i: number , n: number | undefined = undefined ) => {
      if ( n === undefined ) {
        if ( !process[i].phase.some(( stg: Phase ) => stg.completed === false )) return 'var(--success)'
        else if ( i === 0 ) return 'var(--pending)'
        else if ( !process[i - 1]?.phase.some(( stg: Phase ) => stg.completed === false )) return 'var(--pending)'
        else if ( process[i].phase.some(( stg: Phase ) => stg.completed === true )) return 'var(--pending)'
        return ''
      }
      if ( process[i].phase[n].completed === true ) return 'var(--success)'
      else if ( n === 0 && i === 0 ) return 'var(--pending)'
      else if ( n === 0 && process[i].phase[process[i].phase.length - 1]?.completed === true ) return 'var(--pending)'
      else if ( process[i].phase[n -  1]?.completed === true ) return 'var(--pending)'
      return ''
    }

    const handleChatArea = (e: React.ChangeEvent<HTMLTextAreaElement> , i: number = 0 , n: number | undefined = undefined ) => {
      const value = e.target.value
      const title = value.replaceAll(' ', ' ')

      if ( n === undefined ) {
        setProcess(( prev: Process[] )=> prev.map(( val: Process , k: number ) => {
          if ( k === i ) return { ...val ,  title }
          return val
        }).filter(( pro: Process , p: number ) => p === i || pro.phase.some((stg: Phase ) => stg.title.trim())))
        return
      }

      setProcess(( prev: Process[] )=> prev.map(( val: Process , k: number ) => {
        if ( i === k ) {
          const newPhase = val.phase.map(( stg: Phase , p: number) => {
          if ( p === n ) return { ...stg , title }
          return stg
          }).filter((stg: Phase , p: number ) => p === n || stg.title.trim())
          return { ...val , phase: newPhase }
        }
        return val
      }))
    }

    const handleAdd = ({ i ,  n }: { i: number , n?: number }) => {
      const dubArray = [ ...showProcess , { title: '' , phase: [{ title: '', completed: false }]} ]

      if ( n === undefined ) {
        setProcess(( prev: Process[] )=> dubArray.map(( _ , k: number ) => {
          const pre = k - 1
          if ( k < i ) return prev[k]
          else if ( i === k ) return { title: '' , phase: [
            { title: '', completed: false }
          ]}
          return prev[ pre ]
        }).filter(( pro: Process , p: number ) => p === i || pro.title.trim() || pro.phase.some((stg: Phase ) => stg.title.trim())))
        return
      }

      setProcess(( prev: Process[] )=> prev.map(( _ , k: number ) => {
        if ( i === k ) {
          const dubStages = [ ...prev[k].phase , { title: '', completed: false }]
          const newPhase = dubStages.map(( _ , p: number ) => {
            if ( p < n + 1 ) return _
            else if ( p === n + 1 ) return { title: '', completed: false }
            return dubStages[ p - 1 ]
          }).filter((stg: Phase , p: number ) => p === n + 1 || stg.title.trim())
          return { ..._ , phase: newPhase}}
        return prev[ k ]
      })
    )}

    const handleRemove = ({ i ,  n }: { i: number , n?: number }) => {
      if ( n === undefined ) {
        setProcess(( prev: Process[] )=> prev.filter(( _ , k: number ) => i !== k ).filter(( pro: Process , p: number ) => p === i || pro.title.trim() || pro.phase.some((stg: Phase ) => stg.title.trim())))
        return
      }

      setProcess(( prev: Process[] )=> prev.map(( pro: Process , k: number ) => {
        if ( i === k ) {
          const newPhase = pro.phase.length > 1 ? pro.phase.filter(( _ , p: number ) =>  p !== n ).filter((stg: Phase , p: number ) => p === n || stg.title.trim()) : pro.phase
          return { ...pro , phase: newPhase}}
        return pro
      })
    )}

    const handleCompleteStage = ( i: number , n: number ) => {
      if ( !socket ) return
      if ( processProj[i].phase[n].completed ) return
      const processes = processProj.map(( pro: Process , k: number ) => {
        if ( i === k ) {
          const newPhase = pro.phase.map(( _ , p: number ) =>  p === n ? { ..._ , completed: true } : _ ).filter((stg: Phase , p: number ) => p === n || stg.title.trim())
          return { ...pro , phase: newPhase}}
        return pro
      })
      socket.emit('update-project:stgComplete', { projectId: content._id , process: processes })
    }

    const handleProcess = () => {
      let loadings = false
      if ( loading ) return
      if ( processProj === process ) return
      if ( !editting ) return setEditting(true)

      setProcessError('')
      const processes = processProj.map(( pro: Process ) => {
          return { ...pro , phase: pro.phase.filter( phase => phase.title.trim())}
        }
      ).filter(( pro: Process ) => pro.phase.length > 0 )

      if (processes.length < 1 ) return setProcessError('The returned process has no valid string content')

      const noTitle = processes.filter((  pro: Process ) => pro.title.trim() && pro.phase.filter( phase => phase.title.trim()))

      if (noTitle.length < 1 ) return setProcessError('The returned process has no valid title content')

      if ( ready ) {
        loadings = false
        socket?.emit('update-project:process', { projectId: content._id , processProj: processes })
      } else {
        loadings = false
        setProcessError(' Unstable internet connection')
      }
      if (!loadings) setLoading( true )
    }

    useEffect(()=>{
      if ( !user || service === 'contract' ) return
      setShownProcess( editting ? processProj : process )
    } , [ editting , process , processProj ])

    useEffect(()=>{
      if ( !ready ) return
      socket?.on('project-error:process', ({ projectId , message }) => {
        if ( projectId === content._id ) {
          setLoading( false )
          setProcessError( message )
        }
      })
      socket?.on('project-updated:process', ()=>{
        setLoading( false )
        setEditting( false )
      })
      return () => {
        socket?.off('project-error:process')
        socket?.off('project-updated:process')
      }
    }, [ ready ])

    const h2 = () => {
      return <span className='flex gap-2.5 flex-col'>
        {Rocketsvg('ml-10 self-start text-[#7c3aed]')}
        Project process in progress...
      </span>
    }

    if (service !== 'contract') return (
      <section className={styles.processHolder}>
        <section className={styles.process}>
          { !editting && process.length < 1 ? (
            <Defaultbg props={{
              h2: h2(),
              styles: style,
              img: '/homehero.png',
              text: 'Cod-en is configuring your project process This may takes a few hours or days.',
            }}/>
          ) : (
            <>
            { showProcess.map(( pro: Process, i: number )=> (
              <section key={i} className={styles.phase}>
                <EdittablePack
                  text={pro.title}
                  value={pro.title}
                  placeholder='Enter phase title'
                  classes={`${styles.stage} ${styles.h2}`}
                  editting={editting && user?.role == 'admin' }
                  style={ editting ? { flexDirection: 'row-reverse' , color: mode === 'dark' ? 'var(--black)' : '' } : { flexDirection: 'row' }}
                  onChangeArea={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChatArea( e , i )}
                  svg={ editting ? <>
                    <button onClick={()=> handleAdd({ i: i + 1 })}>{AddSvg()}</button>
                    <button onClick={()=> handleRemove({ i: i + 1 })}>{MinusSvg()}</button>
                  </> : <menu style={{ color: getColor( i ) ,  borderColor: getColor( i ) }}>{ i + 1 }</menu>
                }
                />
                { pro.phase.map(( stage: Phase , n: number )=> (
                  <EdittablePack
                    key={n}
                    text={stage.title}
                    value={stage.title}
                    classes={styles.stage}
                    placeholder='Enter new stage'
                    editting={editting && user?.role == 'admin' }
                    onChangeArea={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChatArea( e , i , n )}
                    svg={ editting ? (
                        <>
                          <button onClick={()=> handleAdd({ i , n })}>{AddSvg()}</button>
                          <button onClick={()=> handleRemove({ i , n })}>{MinusSvg()}</button>
                        </>
                      ) : <button onClick={() => handleCompleteStage( i ,  n )} style={{ backgroundColor: getColor( i , n ) }}> { stage.completed ? checkmarkSvg() : loading ? loaderCircleSvg('BIG') : <svg></svg>} </button>}
                  />
                ))}
              </section>
            ))}
            </>
          )}
                
          <p>{processError}</p>

          {user?.role === 'admin' && 
          <div className={styles["last"]}>
             {editting && <button onClick={()=> handleAdd({ i: processProj.length })} className={styles.action}> Add phase </button>}
            <button className={styles.action} onClick={handleProcess}> { editting ? 'Confirm' : 'Make' } changes </button>
          </div>
          }
          <p className='px-10 text-[#7c3aed] self-center text-center'>Project process is subject conditionally to project integration and dev-area changes </p>
        </section>
      </section>
    )
  }

  const IndividualProject = () => {
    if (!content) return <></>
    
    const { _id , url , lang , link , rate , type , name , about , pages , price , scale , userId , reason , status , sector , signed , service , concept , currency , provider , langFrom , features , createdAt , paymentLevel , class: classes ,
    } = content

    const [ notify , setNotify ] = useState(false)
    const [ onEdit , setOnEdit ] = useState(false)
    const [ editor , setEditor ] = useState(false)
    const [ editting , setEditting ] = useState(false)
    const [ isEditting , setIsEditting ] = useState(false)

    const [ loaded , setLoaded ] = useState(false)
    const [ onLoad , setOnLoad ] = useState(false)
    const [ loading , setLoading ] = useState(false)
    const [ isLoading , setIsLoading ] = useState(false)

    const [ loadedError , setLoadedError ] = useState('')
    const [ onLoadError , setOnLoadError ] = useState('')
    const [ loadingError , setLoadingError ] = useState('')
    const [ isLoadingError , setIsLoadingError ] = useState('')
    
    const [ nameProj , setName ] = useState(name)
    const [ rateProj , setRate ] = useState(rate)
    const [ aboutProj , setAbout ] = useState(about)
    const [ urlProj , setUrl ] = useState( url || '' )
    const [ sectorProj , setSector ] = useState(sector)
    const [ statusProj , setStatus ] = useState(status)
    const [ linkProj , setLink ] = useState(link || '')
    const [ langProj , setLang ] = useState( lang || [])
    const [ scaleProj , setScale ] = useState(scale || '')
    const [ conceptProj , setConcept ] = useState(concept)
    const [ pagesProj , setPages ] = useState(pages || '')
    const [ reasonProj , setReason ] = useState(reason || '')
    const [ langFromProj , setLangFrom ] = useState( langFrom || [])
    const [ featuresProj , setFeatures ] = useState( features || [])
    const [ currencyProj , setCurrency ] = useState( currency || '')
    const [ langStateCheck , setLangStateCheck ] = useState(!editor ? lang : langProj)
    const [ langFromStateCheck , setLangFromStateCheck ] = useState(!editor ? langFrom : langFromProj)
    const [ featuresStateCheck , setFeaturesStateCheck ] = useState(!editor ? features : featuresProj)

    const shownClass = classes === 'full' ? 'Full-stack' : classes === 'front' ? 'Front-end' : classes === 'back' ? 'Back-end' : FirstCase(classes)

    useEffect(()=>{
      setLangStateCheck( editor ? langProj : lang )
      setLangFromStateCheck( editor ? langFromProj : langFrom )
      setFeaturesStateCheck( editor ? featuresProj : features )
    }, [ editor , langProj, langFromProj , featuresProj ])

    const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newName = e.target.value
      if ( !isEditting || !user ||  user?.id !== userId) return
      setName( newName.replaceAll('  ', ' ') )
    }

    const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newAbout = e.target.value
      if ( !editting || !user ||  user?.id !== userId) return
      setAbout( newAbout.replaceAll('  ', ' ') )
    }

    const handleConceptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newConcept = e.target.value
      if ( !editting || !user ||  user?.id !== userId) return
      setConcept( newConcept.replaceAll('  ', ' ') )
    }

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRate = e.target.value
      if ( !editting || !user ||  user?.role !== 'admin' ) return
      setRate( newRate.endsWith(' ') ? newRate.slice(0, -1) : newRate )
    }

    const handleSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSector = e.target.value
      if ( !editor || !user ||  user?.role !== 'admin' ) return
      setRate( newSector.endsWith(' ') ? newSector.slice(0, -1) : newSector )
    }

    const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPages = e.target.value
      if ( !editting || !user ||  user?.id !== userId) return
      setPages( newPages.replaceAll('  ', ' ') )
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newName = e.target.value
      if ( !editting || !user || user?.id !== userId ) return
      setCurrency( newName.endsWith(' ') ? newName.slice(0, -1) : newName.toLocaleUpperCase() )
    }

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newReason = e.target.value
      if ( !onEdit || !user ||  user?.role !== 'admin') return
      setReason( newReason.replaceAll('  ', ' ') )
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newStatus = e.target.value
      if ( !onEdit || !user ||  user?.role !== 'admin') return
      setStatus( newStatus.replaceAll('  ', ' ') )
    }

    const handleScaleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newScale = e.target.value
      if ( !editor || !user ||  user?.role !== 'admin') return
      setScale( newScale.replaceAll('  ', ' ') )
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newUrl = e.target.value
      if ( !isEditting || !user ) return
      setUrl( newUrl.replaceAll('  ', ' ') )
    }

    const handleLinkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newLink = e.target.value
      if ( !isEditting || !user ) return
      setLink( newLink.replaceAll('  ', ' ') )
    }

    const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>, i: number ) => {
      const newLang = e.target.value
      if ( !editor || !user ||  user?.role !== 'admin') return
      setLang( prev => prev.map(( l , k ) => i === k ? newLang : l ).filter(( l , n ) => l.trim() || n === i ))
    }

    const handleLangFromChange = (e: React.ChangeEvent<HTMLInputElement>, i: number ) => {
      const newLang = e.target.value
      if ( !editor || !user ||  user?.role !== 'admin') return
      setLangFrom( prev => prev.map(( l , k ) => i === k ? newLang : l ).filter(( l , n ) => l.trim() || n === i ))
    }

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>, i: number ) => {
      const newLang = e.target.value
      if ( !editor || !user ||  user?.role !== 'admin') return
      setFeatures( prev => prev.map(( l , k ) => i === k ? newLang : l ).filter(( l , n ) => l.trim() || n === i ))
    }

    const handleEditting = () => {
      setLoadedError('')
      let loadings = false
      if ( loaded ) return
      if ( !editting) return setEditting( true )
      if ( currencyProj === currency && aboutProj === about && conceptProj === concept ) return setEditting(false)
      else if ( !aboutProj.trim()) setLoadedError('Please write something about your project')
      else if ( !conceptProj.trim()) setLoadedError('Please explain the concept of your project')
      else if ( !['NGN', 'USD', 'GHS', 'KES' , ''].includes(currencyProj) ) setLoadedError('Currency must be in the format of NGN , USD , GHS or KES .')
      else if ( !loaded ) {
      if ( ready ) {
          loadings = true
          setLoaded( true )
          socket?.emit('update-project:editting', { projectId: content._id , conceptProj , aboutProj , currencyProj })
        }
        else setLoadedError('Unstable internet dconnection')
      }
      if (!loadings) setEditting( false )
    }

    const handleOnEdit = () => {
      setLoadingError('')
      let loadings = false
      if ( loading ) return
      if (!onEdit) return setOnEdit( true )
      if ( statusProj === status && reasonProj === reason ) return setOnEdit( false )
      if ( !['waiting', 'active'].includes(statusProj) ) setLoadingError('Status can only be hard-coded to waiting or active.')
      else if ( !loading ) {
      if ( ready ) {
          loadings = true
          setLoading( true )
          socket?.emit('update-project:onEdit', { projectId: content._id , reasonProj , statusProj })
        }
        else setLoadingError('Unstable internet dconnection')
      }
      if (!loadings) setOnEdit( false )
    }

    const handleIsEditting = () => {
      setOnLoadError('')
      let loadings = false
      if ( onLoad ) return
      if ( !isEditting) return setIsEditting( true )
      if ( urlProj === url && linkProj === link && nameProj === name ) return setIsEditting( false )
      if ( !nameProj.trim() ) setOnLoadError('Please provide a name for your project.')
      else if ( nameProj.trim().includes('/') || nameProj.trim().includes('.')) setOnLoadError('"/" or "." are not permitted in name entries .')
      else if ( !onLoad ) {
        if ( ready ) {
          loadings = true
          setOnLoad( true )
          socket?.emit('update-project:isEditting', { projectId: content._id , name: nameProj , link: linkProj , url: urlProj })
        }
        else setOnLoadError('Unstable internet dconnection')
      }
      if (!loadings) setIsEditting( false )
    }

    const handleEditor = () => {
      setIsLoadingError('')
      if ( user?.role !== 'admin' ) return
      if ( !editor ) return setEditor( prev => !prev )
    }

    useEffect(()=>{
      if ( !ready ) return
      socket?.on('project-error:onEdit', ({ projectId , message }) => {
        if ( projectId === content._id ) {
          setLoading( false )
          setLoadingError(message)
        }
      })
      socket?.on('project-error:editor', ({ projectId , message }) => {
        if ( projectId === content._id ) {
          setIsLoading( false )
          setIsLoadingError(message)
        }
      })
      socket?.on('project-error:edittting', ({ projectId , message }) => {
        if ( projectId === content._id ) {
          setLoaded( false )
          setLoadedError(message)
        }
      })
      socket?.on('project-error:isEditting', ({ projectId , message }) => {
        if ( projectId === content._id ) {
          setOnLoad( false )
          setOnLoadError(message)
        }
      })

      socket?.on('project-updated', ( project: Projects ) => {
        if ( project._id === content._id ) setNotify(true)
      })

      socket?.on('project-updated:onEdit', () => {
        setOnEdit(false)
        setLoading(false)
      })
      socket?.on('project-updated:editor', () => {
        setEditor(false)
        setIsLoading(false)
      })
      socket?.on('project-updated:editting', () => {
        setLoaded(false)
        setEditting(false)
      })
      socket?.on('project-updated:isEditting', () => {
        setOnLoad(false)
        setIsEditting(false)
      })

      return () => {
        socket?.off('project-error:onEdit')
        socket?.off('project-error:editor')
        socket?.off('project-error:editting')
        socket?.off('project-error:isEditting')

        socket?.off('project-updated:onEdit')
        socket?.off('project-updated:editor')
        socket?.off('project-updated:editting')
        socket?.off('project-updated:isEditting')
      }
    }, [ ready ])

    return (
      <>
        { notify && <Notify message={`${FirstCase(content.name)} settings updated`}setCondition={setNotify} types='success' />}
        <section className={styles.payment}>
          <h1 className='flex gap-x-5 gap-y-1 flex-wrap items-center justify-between'>Payments <span>{currency?.toLocaleUpperCase() || 'NGN'} {price?.toFixed(2) || 0.00 }</span></h1>
          <menu>
            <p><span style={{ width: `${Math.floor( paymentLevel / 1.1 )}%`, backgroundColor: paymentLevel > 75 ? 'var(--success)' : paymentLevel > 50 ? '#4f46e5' : paymentLevel > 25 ? '#ffaf4b' : 'var(--error)' }}></span></p>
            <Link href='/help/payment'>{Infosvg()}</Link>
            <button>{paymentLevel}%</button>
            { paymentLevel < 100 && <Link href={`/payments/${_id}`} className='flex gap-2 items-center'>Pay with {ShortPayStackSvg()}</Link>}
          </menu>
        </section>

        <section className={styles.project}>
          <h1>Overview</h1>
          <div className={styles.details}>
            <h2> {UnlockSvg()} Project config </h2>
            <span>{
                service === 'web application' ? GlobeSvg() :
                service === 'software application' ? AppSvg() :
                service === 'transcript' ? Devsvg() :
                service === 'upgrade' ? Devsvg() : 
                service === 'contract' ? HandShakeSvg() : Bugsvg()
              }{FirstCase(service)}</span>
            { type && <span>{MenuShortSvg()} {FirstCase(type)} project</span> }
            { shownClass && <span> {BigBookSvg('py-px')} {shownClass}</span> }
            <span> {Searchsvg()} {_id?.toString().toLocaleLowerCase()}</span>
            <p> Created at {format( createdAt , 'do MMMM, yyyy')}</p>
          </div>

          <div className={styles.details}>
            <h2> {Booksvg('isBig')} Project details </h2>

            <EdittablePack svg={Feedbacksvg()} value={about} placeholder='Briefly describe project' onChangeArea={handleAboutChange} text={aboutProj} editting={editting && user?.id === userId } />

            <EdittablePack svg={Infosvg()} value={concept} placeholder='Enter project concept' onChangeArea={handleConceptChange} text={conceptProj} editting={editting && user?.id === userId } />

            <EdittablePack svg={TagSvg('isBig')} text={currencyProj} editting={editting && user?.id === userId } onChangeArea={handleCurrencyChange} placeholder='Specify preferred currency' value={currency?.toLocaleLowerCase() || 'Not specified ( defaults to NGN )'} />

            <EdittablePack svg= {ResourcesSvg()} text={sectorProj} editting={ editor && user?.role === 'admin' }  rev={true} onChangeInput={handleSectorChange} placeholder='Specify project sector' value={FirstCase(sector) || 'No sector specified'} />

            { scale && <EdittablePack svg={<svg className='border-8 rounded-full'></svg>} value={`${FirstCase(scale)} scale`} text={scaleProj} onChangeArea={handleScaleChange} editting={ editor && user?.role === 'admin'} />}

            <span> {provider === 'github' ? Githubsvg('BIG') : provider === 'domain' ? GlobeSvg() : provider === 'vercel' ? Vercelsvg('big') : ProjectSvg() } {FirstCase(provider)}</span>

            <p className={styles.error}>{loadedError}</p>
            
            { user?.id === userId && <div className='flex gap-2.5 flex-col items-center'>
                <button className='self-end mr-[10%] rounded-br-[3px!important]'><Link href='/portfolio/projects'> Get samples </Link></button>
                <button disabled={loaded} className='w-4/5' onClick={handleEditting}> { loaded && loaderCircleSvg('BIG')} { loaded ? `Confirm${ editting ?  'ing' : '' } updates` : 'Update details'} {loaded ? '...' : '' }</button>
              </div>
            }
          </div>

          <div className={styles.details + ' ' + styles.interactions}>
            <h2> {ShuffleSvg('stroke-[currentColor] isBig')} Interactions </h2>
            {( reason || user?.role === 'admin') && <EdittablePack svg={SupportSvg()} onChangeArea={handleReasonChange} value={reason || 'Add status reason'} text={reasonProj} editting={onEdit} />}

            <EdittablePack svg={HistorySvg()} value={status} onChangeArea={handleStatusChange} text={statusProj} editting={onEdit} />

            { url && <span> <a href={url} target="_blank" rel="noopener noreferrer">{Linksvg()} View project source file </a></span>}

            <span> <svg className='border-8 rounded-full'></svg> {signed ? 'Signed' : 'Not signed'}</span>
            
            <p className={styles.error}>{loadingError}</p>

            { user?.role === 'admin' && <button disabled={loading} className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleOnEdit}> { onEdit ? `Confirm${ onEdit ?  'ing' : '' } status` : 'Update status'} { loading ? '...' : '' }</button>}
          </div>
          <div className={styles.end}>
            <Link href='/inbox'> {Linksvg()} { name } inbox </Link>
            <button> { DeleteSvg() } Terminate project </button>
          </div>
        </section>

        <section className={styles.project}>
          <h1>Settings</h1>
          {service.includes('application') ? (
            <>
              <div className={styles.details}>
                <h2> {SettingSvg()} General</h2>
                
                <EdittablePack svg={GlobeSvg()} text={linkProj} onChangeArea={handleLinkChange} editting={isEditting} placeholder='Add your preferred completed project link' value={link || 'https://preferred.link.com'} />

                <EdittablePack svg={AppSvg()} onChangeArea={handleNameChange} text={nameProj} value={name} editting={ user?.id === userId && isEditting} placeholder='Change project name' />
                
                <EdittablePack svg={Locationsvg()} text={urlProj} onChangeArea={handleUrlChange} editting={isEditting} placeholder='Enter project source file url'  value={ url || 'https://resource.url.com' }/>
                
                { <button disabled={onLoad} className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleIsEditting}> { onLoad && loaderCircleSvg('BIG')} { isEditting ? `Confirm${ onLoad ?  'ing' : '' } changes` : ' Edit settings'} { onLoad ? '...' : '' } </button>}
            
                <p className={styles.error}>{ onLoadError }</p>

                { langStateCheck?.length < 2 &&  <>
                  <h2> {Devsvg()} Languages </h2>
                  { langStateCheck.map(( _ , i: number ) =>  <EdittablePack rev={true} key={i} value={lang[i] || ''} editting={editor} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>)=> handleLangChange( e , i )} text={langProj[i] || ''} placeholder='New language' style={{ color: 'rgb(79, 70, 229)' }}/>)}
                  {  user?.role === 'admin' && editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setLang( prev => [ ...prev.filter( l => l.trim()), '' ] )}> Add Language </button>}
                </>}
              </div>

              { langStateCheck?.length >= 2 && <div className={styles.details}>
                  <h2> {Devsvg()} Languages </h2>
                  { langStateCheck.map(( _ , i: number ) =>  <EdittablePack rev={true} key={i} value={lang[i] || ''} editting={editor} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>)=> handleLangChange( e , i )} text={langProj[i] || ''} placeholder='New language' style={{ color: 'rgb(79, 70, 229)' }}/>)}
                  {  user?.role === 'admin' && editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setLang( prev => [ ...prev.filter( l => l.trim() ), '' ] )}> Add Language </button>}
                </div>
              }
              
              <div className={styles.details} style={{ flex: 1.5 }}>
                <h2>Features</h2>
                { featuresStateCheck.length < 1 ? 'No feature added' : featuresStateCheck.map(( _ , i: number ) =>  <EdittablePack rev={true} key={i} value={features[i] || ''} editting={editor} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>) => handleFeaturesChange( e , i )} text={featuresProj[i] || ''} placeholder='New feature' style={{ color: 'rgb(79, 70, 229)' }}/>)}
                
                <p>{isLoadingError}</p>

                {  user?.role === 'admin' && (
                  <div className='flex gap-2.5 flex-wrap justify-end'>
                    <button  onClick={handleEditor}>{isLoading && loaderCircleSvg('BIG')} { editor ? `Confirm${ isLoading ?  'ing' : '' } changes` : ' Edit dev-area'} </button>
                    { editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setFeatures( prev => [ ...prev.filter( l => l.trim() ), '' ] )}> Add Feature </button>}
                  </div>
                )}
              </div>
              <div className={styles.end}>
                <Link href={`project/${id}/stats`}> {Linksvg()} View previous versions settings </Link>
              </div>
            </>
          ) : service === 'transcript' ? (
            <>
              <div className={styles.details}>
                <EdittablePack svg={GlobeSvg()} text={linkProj} onChangeArea={handleLinkChange} editting={isEditting} placeholder='Add your preferred completed project link' value={link || 'https://preferred.link.com'} />

                <EdittablePack svg={AppSvg()} onChangeArea={handleNameChange} text={nameProj} value={name} editting={ user?.id === userId && isEditting} placeholder='Change project name' />
                
                <EdittablePack svg={Locationsvg()} text={urlProj} onChangeArea={handleUrlChange} editting={isEditting} placeholder='Enter project source file url'  value={ url || 'https://resource.url.com' }/>

                { pages && <EdittablePack svg={ResourcesSvg()} value={pages} rev={true} onChangeInput={handlePagesChange} placeholder='Enter page count ( defaults as Auto )' text={pagesProj || ''} editting={editor && user?.role === 'admin'}/>}

                <p className={styles.error}>{ onLoadError }</p>
                
                <button disabled={onLoad} className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleIsEditting}> { onLoad && loaderCircleSvg('BIG')} { isEditting ? `Confirm${ onLoad ?  'ing' : '' } changes` : ' Edit settings'} { onLoad ? '...' : '' } </button>
              </div>

              <div className={styles.details}>
                <h2> {Devsvg()}Project Languages </h2>
                { langFromStateCheck?.map(( _ , i: number ) =>  <EdittablePack rev={true} key={i} editting={editor} value={langFrom[i] || ''} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>)=> handleLangFromChange( e , i )} text={langFromProj[i] || ''} placeholder='Add project pre-written language' style={{ color: 'rgb(79, 70, 229)' }}/>)}
                { user?.role === 'admin' && editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setEditor(true) && setLangFrom( prev => [ ...prev.filter( l => l.trim() ), '' ] )}> Add Language </button>}
              </div>
              
              <div className={styles.details}>
                <h2>Encrypting languages</h2>
                {langStateCheck?.map(( _ , i: number ) => <EdittablePack rev={true} key={i} editting={editor} value={lang[i] || ''} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>)=> handleLangChange( e , i )} text={langProj[i] || ''} placeholder='New language' style={{ color: 'rgb(79, 70, 229)' }}/>)}
                
                <p>{isLoadingError}</p>
                
                {  user?.role === 'admin' && (
                  <div className='flex gap-2.5 flex-wrap justify-end'>
                    <button  onClick={handleEditor}>{isLoading && loaderCircleSvg('BIG')} { editor ? `Confirm${ isLoading ?  'ing' : '' } changes` : ' Edit languages'} </button>
                    { editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setEditor(true) && setLang( prev => [ ...prev.filter( l => l.trim() ), '' ] )}> Add Language </button>}
                  </div>
                )}
              </div>
              <div className={styles.end}>
                <Link href={`project/${id}/stats`}> {Linksvg()} View previous versions settings </Link>
              </div>
            </>
          ) : service.includes('quality-assurance') ? (
            <>
              <div className={styles.details} style={{ flex: 2 }}>
                <h2> {SettingSvg()} General</h2>
                
                <EdittablePack svg={GlobeSvg()} text={linkProj} onChangeArea={handleLinkChange} editting={isEditting} placeholder='Add your preferred completed project link' value={link || 'https://preferred.link.com'} />

                <EdittablePack svg={AppSvg()} onChangeArea={handleNameChange} text={nameProj} value={name} editting={ user?.id === userId && isEditting} placeholder='Change project name' />
                
                <EdittablePack svg={Locationsvg()} text={urlProj} onChangeArea={handleUrlChange} editting={isEditting} placeholder='Enter project source file url'  value={ url || 'https://resource.url  .com' }/>
                
                <p className={styles.error}>{ onLoadError }</p>
                
                <button disabled={onLoad} className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleIsEditting}> { onLoad && loaderCircleSvg('BIG')} { isEditting ? `Confirm${ onLoad ?  'ing' : '' } changes` : ' Edit settings'} { onLoad ? '...' : '' } </button>
              </div>

              { pages && <div className={styles.details}>
                <EdittablePack svg={ResourcesSvg()} value={pages} rev={true} onChangeInput={handlePagesChange} text={pagesProj}  placeholder='Enter page count ( defaults as Auto )' editting={editor && user?.role === 'admin'}/>
                
                <p>{isLoadingError}</p>
                
                <button className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleEditor}>{isLoading && loaderCircleSvg('BIG')} { editor ? `Confirm${ isLoading ?  'ing' : '' } changes` : ' Edit settings'} </button>
              </div>}

              <div className={styles.end}>
                <Link href={`project/${id}/stats`}> {Linksvg()} View previous versions settings </Link>
              </div>
            </>
          ): service === 'contract' || service === 'upgrade' ? (
            <>
              <div className={styles.details}>
                <h2> {SettingSvg()} General</h2>
                
                <EdittablePack svg={GlobeSvg()} text={linkProj} onChangeArea={handleLinkChange} editting={isEditting} placeholder='Add your preferred completed project link' value={link || 'https://preferred.link.com'} />

                <EdittablePack svg={AppSvg()} onChangeArea={handleNameChange} text={nameProj} value={name} editting={ user?.id === userId && isEditting} placeholder='Change project name' />
                
                <EdittablePack svg={Locationsvg()} text={urlProj} onChangeArea={handleUrlChange} editting={isEditting} placeholder='Enter project source file url'  value={ url || 'https://resource.url.com' }/>

                { rate && <EdittablePack svg={Refreshsvg()} value={rate} text={rateProj || ''}onChangeInput={handleRateChange} rev={true} placeholder='Project recurring interval' editting={editor && user?.role === 'admin'}/>}
                
                <p className={styles.error}>{ onLoadError }</p>
                
                <button disabled={onLoad} className='self-end mr-[10%] rounded-br-[3px!important]' onClick={handleIsEditting}> { onLoad && loaderCircleSvg('BIG')} { isEditting ? `Confirm${ onLoad ?  'ing' : '' } changes` : ' Edit settings'} { onLoad ? '...' : '' } </button>
              </div>
              <div className={styles.details} style={{ flex: 1.5 }}>
                <h2>Features</h2>
                { featuresStateCheck.length < 1 ? 'No feature added' : featuresStateCheck.map(( _ , i: number ) => <EdittablePack rev={true} key={i} value={features[i] || ''} onChangeInput={(e: React.ChangeEvent<HTMLInputElement>) => handleFeaturesChange( e , i )} text={featuresProj[i] || ''} placeholder='New feature' editting={editor}  style={{ color: 'rgb(79, 70, 229)' }}/>)}
                
                <p>{isLoadingError}</p>

                {  user?.role === 'admin' && (
                  <div className='flex gap-2.5 flex-wrap justify-end'>
                    <button  onClick={handleEditor}>{isLoading && loaderCircleSvg('BIG')} { editor ? `Confirm${ isLoading ?  'ing' : '' } changes` : ' Edit features'} </button>
                    { editor && <button className='self-end rounded-br-[3px!important]' onClick={()=> user?.role === 'admin' && setFeatures( prev => [ ...prev.filter( l => l.trim() ), '' ] )}> Add Feature </button>}
                  </div>
                )}
              </div>
              <div className={styles.end}>
                <Link href={`project/${id}/stats`}> {Linksvg()} View previous versions settings </Link>
              </div>
            </>
          ): <></>}
        </section>
      </>
    )
  }

  return (
    <main id={style.main}>
      <div className={style.main}>
        <h2 className={style.title}>{ProjectSvg()} {content?.name || 'Project details'}</h2>
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

        <IndividualProject />
        <ProjectProcess />
        {error && <button disabled={isLoading} className={style.floater} onClick={()=>setRefresh((prev: boolean) => !prev )}>{isLoading ? loaderCircleSvg('BIG') : Refreshsvg()}</button>}
      </div>
      <div className={home.background2} style={{ position: 'fixed' }}></div>
      <Footer />
    </main>
  )
}

export default Project
