"use client"
import Link from 'next/link'
import style from './page.module.css'
import styles from './../../main.module.css'
import Footer from '@/src/components/Footer'
import ChatInput from '@/src/components/ChatBox'
import { useSocket } from '@/src/context/SocketContext'
import React, { ReactNode, useEffect, useState } from 'react'
import { NewDropSets, Notify } from '@/src/components/pageParts'
import { useProjectContext } from '@/src/context/ProjectContext'
import { classAdd, classRemove, classToggle, Click, FirstCase, pick, RemoveOtherClass } from '@/src/components/functions'
import { AddProjectsvg, AddSvg, Buildsvg, Cloudsvg, Devsvg, FolderSvg, Githubsvg, Helpsvg, HTMLsvg, Leftsvg, loaderCircleSvg, Nextsvg, Nodesvg, ProjectSvg, Reactsvg, Rocketsvg, Rustsvg, TagSvg } from '../../../components/svgPack'

type btn = {
  txt: string
  query: string
  svg: ReactNode
}

type Blogs = {
  props: {
    type: string
    title: string;
    svg: ReactNode;
  }
}

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

const NewProject = () => {
  const [ err, setErr ] = useState('')
  const [ url, setUrl ] = useState('')
  const [ name, setName ] = useState('')
  const [ rate, setRate ] = useState('')
  const [ error, setError ] = useState('')
  const [ about, setAbout ] = useState('')
  const [ lang , setLang ] = useState([''])
  const [ scale , setScale ] = useState('')
  const [ read , setRead ] = useState(false)
  const [ reason, setReason ] = useState('')
  const [ sec, setSec ] = useState('custom')
  const [ mode , setMode ] = useState('dev')
  const [ sector, setSector ] = useState('')
  const [ type, setType ] = useState('Full')
  const [ pages , setPages ] = useState('< 5')
  const [ concept, setConcept ] = useState('')
  const [ service , setService ] = useState('')
  const [ notify , setNotify ] = useState(false)
  const [ langFrom , setLangFrom ] = useState([''])
  const [ request , setRequest ] = useState(false)
  const [ classes, setClasses ] = useState('full')
  const [ features, setFeatures ] = useState([''])
  const [ isLoading , setIsLoading ] = useState(false)
  const [ provider, setProvider ] = useState('domain')
  const sectArr = ['e-commerce', 'sol', 'docs']
  const { project } = useProjectContext()
  const { socket , ready } = useSocket()
  const [ fill , setFill ]: [string | boolean, React.Dispatch<React.SetStateAction<string>>]= useState('')

  function TypeSects ({props}: Blogs) {
    return(
      <section className='var(--sweetPurple), var(--deepSweetPurple)'>
        {props.svg}
        {props.title}
        <button disabled={service !== ''} onClick={()=> {
          setService(props.type)
          if (props.type.includes('web')) {setClasses('full'); setProvider('domain')}
          if (props.type === 'transcript') {setType('full'); setPages('< 5')}
          if (!props.type.includes('software')) setClasses('full')
          if (!props.type.includes('web')) setProvider('github')
          if (props.type.includes('software')) setClasses('os')
          if (props.type === 'contract') setRate('monthly')
        }}> Create {props.type}</button>
      </section>
    )
  }

  const autoSave = () => {
    if (!service) return
    localStorage.removeItem('draft')
    const draft = {
      url, sec, name, rate, type, lang, about, pages, scale, sector, service, classes, concept, langFrom, features, provider
    }
    localStorage.setItem('draft', JSON.stringify(draft))
    setNotify(true)
    setReason('saved')
  }

  const autoFill = () => {
    if (!fill) return
    if (request) return
    if ( fill === 'draft') {
      const draft = JSON.parse(localStorage.getItem('draft') || '')
      if (!draft) {setNotify(true); setReason('draft'); return}
      setSec(draft.sec);
      setName(draft.name);
      setRate(draft.rate);
      setType(draft.type);
      setLang(draft.lang);
      setAbout(draft.about);
      setPages(draft.pages);
      setScale(draft.scale);
      setSector(draft.sector);
      setService(draft.service);
      setClasses(draft.classes);
      setConcept(draft.concept);
      setLangFrom(draft.langFrom)
      setFeatures(draft.features);
      setProvider(draft.provider);
      setUrl( draft.provider !== 'github' ? draft.url.replaceAll('/','').replaceAll('.', '') : draft.url);
      setNotify(true); setReason('drafted');
      return
    }
    else if (!service) {setNotify(true); setReason('not-drafted'); return}
    else if (!name || !about || !concept) {setNotify(true); setReason('not-complete')}
    if ( fill === 'quality') return
    setNotify(true); setReason('complete')
  }

  const save = () => {
    setErr('')
    setError('')
    setLang((prev: string[]) => prev.filter((l: string)=> l))
    setFeatures((prev: string[]) => prev.filter((f: string)=> f))
    if (!name) setErr('Project name is required')
    else if (!concept) setErr('Project concept is required')
    else if (!about) setErr('No information was given for project nature')
    else if (!sector) setErr('Project sector is required. Either choose one or enter a custom sector')
    else if (provider === 'github' && !url ) setErr("Url is a required field when provider is Github. Enter your project's repository or change provider")
    else if ((service.includes('quality') || service === 'upgrade' || service === 'contract') && !scale ) setErr(`Scale is required for ${FirstCase(service)} project`)
    else if (lang.length < 1 && (service.includes('application') || service === 'transcript')) {
      mode === 'assist' ? Click(`.${style.auto}`) : setErr('Language is required')
    }
    else if (!request) setRequest(true)
    else if (!ready) { setNotify(true); setReason('failed'); setError('Could not submit project details')}
    else{ setIsLoading(true); socket.emit("create-project", project )}
    return
  }

  if(ready) socket.on("project-created", ()=>{
    setNotify(true)
    setIsLoading(false)
    setReason('created')
  })

  const resizeCheck = () => {
    const holder = pick(`.${style.holder}`).style
    if (request) {
      holder.translate = '-67%'
      holder.maxHeight = `${pick(`.${style.form}`).offsetHeight + 20}px`
    } else if (service) {
      holder.gap = '20px'
      holder.translate = '-33.3%'
      holder.maxHeight = `${pick(`.${style.fillerForm}`).offsetHeight + 20}px`
    } else {
      holder.gap = '10px'
      holder.translate = 0
      holder.maxHeight = 'none'
    }
  }

  useEffect(()=>{
    return () => {
      mode === 'assist' && autoSave()
    }
  }, [])
  
  useEffect(()=>{
    if (classes === 'back') setLang((prev: string[]) => prev.filter((l: string) => !['react', 'html'].includes(l)))
    if (classes !== 'front') setLang((prev: string[]) => prev.filter((l: string) => !['html'].includes(l)))
    if (classes === 'front') setLang((prev: string[]) => prev.filter((l: string) => !['rust'].includes(l)))
    if (service === 'transcript') setLang((prev: string[]) => prev.filter((l: string) => l && l !== 'auto'))
    else setLangFrom([''])
    if (lang.includes('auto')) classAdd('#flang', style.inActive)
    else classRemove('#flang', style.inActive)
    if (pages === 'auto') {
      classAdd('#pages', style.inActive)
      classRemove('#pages', style.inView)
    }
    else classRemove('#pages', style.inActive)
  })

  useEffect(()=>{
    setErr('')
    setError('')
    resizeCheck()
    if (!service){
      setLang([])
      setRate('')
      setPages('')
      setScale('')
      setClasses('')
      setConcept('')
      setType('full')
      setFeatures([''])
    }
    if (!request) setRead(false)
    window.addEventListener('scroll', resizeCheck)
    window.addEventListener('resize', resizeCheck)
    return () => {
      window.removeEventListener('scroll', resizeCheck)
      window.removeEventListener('resize', resizeCheck)
    }
  }, [ service , request ])

  return (
    <main id={styles.main} onClick={()=>{
      const holder = pick(`.${style.holder}`).style
      if (request) holder.maxHeight = `${pick(`.${style.form}`).offsetHeight + 20}px`
      else if (service) {
        setTimeout(()=> {if(holder.translate === '-33.3%') holder.maxHeight = `${pick(`.${style.fillerForm}`).offsetHeight + 20}px`}, 500)
      } else holder.maxHeight = 'none'
    }}>
      <div className={styles.main} style={{overflow: 'hidden'}}>
        <h2 className={styles.title}>{AddProjectsvg()} Create {service ? FirstCase(service) : 'Project'}</h2>
        <div className={`${styles.help} flex-wrap`}>
          <NewDropSets props={{
            id: 'mode',
            query: mode,
            listen: true,
            class: styles.inView,
            buttons: [
              {txt: 'Help mode', query: 'assist', func: ()=>{ setMode('assist'); ((service === 'transcript' && pages !== 'auto') || (service.includes('application') && !lang.includes('auto'))) && Click(`.${style.auto}`)}, svg: TagSvg('BIG')},
              {txt: 'Dev mode', query: 'dev', func: ()=>{ setMode('dev'); ((service === 'transcript' && pages === 'auto') || (service.includes('application') && lang.includes('auto'))) && Click(`.${style.auto}`)}, svg: Devsvg()}
            ]
          }}/>
          <menu id='fill' onClick={()=>RemoveOtherClass('#fill', styles.inView, 'menu')}>
            <button onClick={()=>classToggle('#fill', style.inView)}>{Buildsvg()} Auto-fill</button>
            <section className={style.autoFill}>
              <span onClick={()=> setFill((prev: string) => prev === 'quality' ? '' : 'quality')}><svg style={ fill === 'quality'? {color: '#73a222', transition: '0.3s'} : {}}></svg> Quality priority</span>
              <span onClick={()=> setFill((prev: string) => prev === 'balanced' ? '' : 'balanced')}><svg style={ fill === 'balanced'? {color: '#73a222', transition: '0.3s'} : {}}></svg> Balanced priority</span>
              <span onClick={()=> setFill((prev: string) => prev === 'budget' ? '' : 'budget')}><svg style={ fill === 'budget'? {color: '#73a222', transition: '0.3s'} : {}}></svg> Budget priorty</span>
              <span onClick={()=> setFill((prev: string) => prev === 'draft' ? '' : 'draft')}><svg style={ fill === 'draft'? {color: '#73a222', transition: '0.3s'} : {}}></svg> Load draft</span>
              <button disabled={fill === ''}  onClick={()=>{classRemove('#fill', style.inView); autoFill()}}> Confirm</button>
            </section>
          </menu>
          <Link href="/help/create-project">{Helpsvg()}  Help</Link>
        </div>
        { notify && <Notify message='You have no account project to select from' setCondition={setNotify} types='error' condition={reason === 'projects'} />}
        { notify && <Notify message='You have no draft in local storage' setCondition={setNotify} types='error' condition={reason === 'draft'} />}
        { notify && <Notify message='Draft saved locally in storage' setCondition={setNotify} types='success' condition={reason === 'saved'} />}
        { notify && <Notify message='Draft loaded successfully' setCondition={setNotify} types='success' condition={reason === 'drafted'} />}
        { notify && <Notify message='Non-draft autosaves require a service' setCondition={setNotify} types='error' condition={reason === 'not-drafted'} />}
        { notify && <Notify message='Project created' setCondition={setNotify} types='success' condition={reason === 'created'} />}
        { notify && <Notify message='Unstable internet connection' setCondition={setNotify} types='error' condition={reason === 'failed'} />}
        { notify && <Notify message='Auto-fill complete' setCondition={setNotify} types='success' condition={reason === 'complete'} />}
        { notify && <Notify message={`Auto save could not find project ${`${[{x: name, y: 'name'}, {x: about, y: 'about'}, {x: concept, y: 'concept'}].map((i)=> { if (!i.x) return i.y}).filter((i)=> i).slice(0, -1).join(', ')}`}${[name, about, concept].filter((i)=> !i).length > 1 ? ' and ' : ''}${[{x: name, y: 'name'}, {x: about, y: 'about'}, {x: concept, y: 'concept'}].filter((i)=> !i.x).slice(-1)[0]?.y} info`} setCondition={setNotify} condition={reason === 'not-complete'} />}
        <div className={style.holder}>
          <form className={style.typeSelector}>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Create website, web pages or blogs with your custom or free domain',
              type: 'web application'
            }}/>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Change programming language and get better turn-outs',
              type: 'transcript'
            }}/>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Proofguard your code from production and development bugs',
              type: 'quality-assurance testing'
            }}/>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Secure long-term/ re-occuring programming services for efficient software management',
              type: 'contract'
            }}/>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Create new task-specific functionality from your existing projects',
              type: 'upgrade'
            }}/>
            <TypeSects props={{
              svg: Devsvg(),
              title: 'Create your desired project functionality for different devices',
              type: 'software application'
            }}/>
          </form>
          <form className={style.fillerForm} onSubmit={(e: React.FormEvent)=> e.preventDefault()}>
            <div className='flex flex-wrap gap-3 justify-end text-[#feffd7]'>
              <div className={style.error}>{err}</div>
              <button className='bg-[var(--success)]' onClick={(e: React.FormEvent)=>{e.preventDefault(), setService('')}} disabled={service === ''}>{Leftsvg('rotate-180 p-1')} Back</button>
              <button className='bg-[var(--success)]' onClick={(e: React.FormEvent)=> {e.preventDefault(); autoSave()}} disabled={service === '' }>{FolderSvg()} Draft</button>
              <button className='bg-[var(--success)]' onClick={(e: React.FormEvent)=>{e.preventDefault(), save()}} disabled={service === ''}>{Rocketsvg('BIG')} Create</button>
            </div>
            {!service ? <></> : service.includes('application') ? <>
              <section id='features' style={{flexDirection: 'column'}}>
                <p>Features</p>
                {features.map((feat: string, i: number)=>(
                  <div className={`${style.input} ${style.only}`} key={i}>
                    <input type="text" placeholder='Enter new project feature' value={feat} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFeatures((prev: string[]) =>[...prev.map((f: string, n: number)=>{return n === i ? e.target.value : f})])} onClick={ () => feat.trim() !== '' && setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== '')])}/>
                  </div>
                ))}
                <menu id='add' className={style.special} style={{maxWidth: 'fit-content', placeSelf: 'flex-end'}} onMouseEnter={()=>{classAdd('#add', style.inView); RemoveOtherClass('#add', style.inView, 'menu')}} onClick={()=> classToggle('#add', style.inView)}><span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)'}} onClick={()=>setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), ''])}>{AddSvg()}</span>
                  {(!['Live chatting', 'Payments', 'Mail sending', 'OAuth', 'Charts', 'Admin dashboard'].some((sel: string) => features.includes(sel.trim().toLocaleLowerCase()))) && <div>
                    {['Live chatting', 'Payments', 'Mail sending', 'OAuth', 'Charts', 'Admin dashboard'].map((sel: string, i: number) => !features.includes(sel) && <span key={i} onClick={()=>setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), sel])}>{sel}</span>)}
                  </div>}
                </menu>
              </section>
              <section id={style.lang}>
                <p>Languages</p>
                <h2 className='flex w-full flex-wrap gap-2.5'>{lang.filter((l: string) => l && l !=='auto' ).map((l: string, i: number) => <div key={i} className={styles.input} onDoubleClick={()=>setLang((prev: string[]) => [...prev.filter((lang: string) => lang && lang !== l)])}>{FirstCase(l)}</div>)}</h2>

                <span className={style.auto} style={ lang.includes('auto') ? {color: '#2ba12b', opacity: 1} : {}} onClick={()=> setLang((prev: string[])=> prev.includes('auto') ? prev.filter((l: string)=> l && l !== 'auto') : ['auto'])}> <svg></svg> Auto discover</span>

                <NewDropSets props={{
                    query: '',
                    id: 'flang',
                    class: style.inView,
                    buttons: classes === 'front' ? [
                      {txt: 'Add language', query: '', func: ()=>{}, svg: AddSvg()},
                      {txt: 'Next.js', query: 'next', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'next'), 'next']), svg: Nextsvg()},
                      {txt: 'HTML', query: 'html', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'html'), 'html']), svg: HTMLsvg()},
                      {txt: 'React', query: 'react', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'react'), 'react']), svg: Reactsvg()}
                    ] : classes === 'back' ? [
                      {txt: 'Add language', query: '', func: ()=>{}, svg: AddSvg()},
                      {txt: 'Next.js', query: 'next', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'next'), 'next']), svg: Nextsvg()},
                      {txt: 'Node + express', query: 'node', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'node'), 'node']), svg: Nodesvg()},
                      {txt: 'Rust', query: 'rust', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'rust'), 'rust']), svg: Rustsvg()}
                    ] : [
                      {txt: 'Add language', query: '', func: ()=>{}, svg: AddSvg()},
                      {txt: 'Next.js', query: 'next', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'next'), 'next']), svg: Nextsvg()},
                      {txt: 'Node + express', query: 'node', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'node'), 'node']), svg: Nodesvg()},
                      {txt: 'Rust', query: 'rust', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'rust'), 'rust']), svg: Rustsvg()},
                      {txt: 'React', query: 'react', func: ()=> setLang((prev: string[]) => [...prev.filter((l: string) => l && l !== 'react'), 'react']), svg: Reactsvg()}
                    ]
                  }}/>
              </section>
              <section>
                <p>About</p>
                <div className={`${style.input} ${style.only}`}>
                  <p>Project concept</p>
                  <ChatInput maxHeight='250px' placeholder={mode === 'assist' ? `Cod-en's objective is to empower businesses by creating a mobile space or other web projects for them. Users should be able to create projects, edit projects and make payments for project, with CRUD processes for other regular account activities like history, notifications, etc.` : "Your project idea, scopes or prospective task-mangement"} value={concept} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}/>
                </div>
                <div>
                  <p>Project sector</p>
                  <NewDropSets props={{
                    query: sec,
                    listen: true,
                    id: 'sector',
                    class: style.inView,
                    buttons: [
                      {txt: 'E-commerce', query: 'e-commerce', func: ()=>{setSec('e-commerce'); setSector('e-commerce')}},
                      {txt: 'Solana', query: 'sol', func: ()=>{setSec('sol'); setSector('sol')}},
                      {txt: 'documentaries', query: 'docs', func: ()=>{setSec('docs'); setSector('docs')}},
                      {txt: 'custom', query: 'custom', func: ()=>{setSec('custom'); setSector('')}}
                    ]
                  }}/>
                  {!sectArr.includes(sector) && <div className={style.input}>
                    <input type="text" name="sector" placeholder='Enter custom sector' value={sector} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setSector(e.target.value.trim()); sectArr.includes(sector) && setSec(e.target.value)}}/>
                  </div>}
                </div>
                <div className={`${style.input} ${style.only}`}>
                  <p>About</p>
                  <input type="text" name="about" placeholder={mode === 'assist' ? 'A web development company' : "Describe your project nature"} value={about} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}/>
                </div>
                <div className={`${style.input} ${style.only}`}>
                  <p>Project name</p>
                  <input type="text" name="project_name" placeholder={mode === 'assist' ? 'Cod-en' : "Your project name or title"} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{setName(e.target.value); (url.trim()=== '' || url.replaceAll('-',' ').replaceAll('.', '').replaceAll('/', '') === name.toLocaleLowerCase()) && mode === 'assist' && setUrl(e.target.value.replaceAll(' ', '-').toLocaleLowerCase())}}/>
                </div>
              </section>
              <section id='integrations'>
                <p>Integrations</p>
                <div id='providers' className='flex-wrap'>
                  <p>Provider</p>
                  <NewDropSets props={{
                    listen: true,
                    id: 'provider',
                    query: provider,
                    class: style.inView,
                    buttons:  service === 'software application' ? [
                      {svg: Githubsvg('p-0.5'), txt: 'Github', query: 'github', func: ()=>setProvider('github')}
                    ] : type !== 'part' ? [
                      {txt: 'Vercel', query: 'vercel', func: ()=>setProvider('vercel')},
                      {svg: Cloudsvg(), txt: 'Domain', query: 'domain', func: ()=>setProvider('domain')}
                    ] : [
                      {txt: 'Vercel', query: 'vercel', func: ()=>setProvider('vercel')},
                      {svg: Cloudsvg(), txt: 'Domain', query: 'domain', func: ()=>setProvider('domain')},
                      {svg: Githubsvg('p-0.5'), txt: 'Github', query: 'github', func: ()=>setProvider('github')}
                    ]
                  }}/>
                  <div className={style.input}>
                    <span>{provider === 'github' ? 'https://github/' : provider === 'domain' ? 'www.' : 'https://'}</span>
                    <input type="text" name="provider" placeholder={provider === 'github' ? "your-project-github-repo" : "your-preferred-url"} value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ provider !== 'github' ? setUrl(e.target.value.trim().replaceAll('/','').replaceAll('.', '')) : setUrl(e.target.value.trim().replaceAll('.', ''))}}/>
                    {provider === 'vercel' && <span>.{provider}.app</span>}
                    {(provider === 'domain' || provider === 'github') && <span>.com</span>}
                  </div>
                </div>
                <div id="type">
                  <p>Project type</p>
                  <NewDropSets props={{
                    id: 'types',
                    query: type,
                    listen: true,
                    class: style.inView,
                    buttons: [
                      {txt: 'Full project', query: 'full', func: ()=>{ type !== 'full' && service !== 'software application' && setProvider('domain'); setType('full')}},
                      {txt: 'Part project', query: 'part', func: ()=>{ type !== 'part' && setProvider('github'); setType('part'); setUrl((prev: string) => prev.replaceAll('/', ''))}},
                    ]
                  }}/>
                  <NewDropSets props={{
                    listen: true,
                    id: 'classes',
                    query: classes,
                    class: style.inView,
                    buttons: service === 'software application' ? [
                      {txt: mode !== 'assist' ? 'OS devices' : 'Apple devices', query: 'os', func: ()=> setClasses('os')},
                      {txt: mode !== 'assist' ? 'MS devices' : 'Microsoft devices', query: 'ms', func: ()=> setClasses('ms')},
                      {txt: 'Android devices', query: 'androids', func: ()=> setClasses('androids')}
                    ] : [
                      {txt: mode !== 'assist' ? 'Front-end' : 'User interface design', query: 'front', func: ()=> {setClasses('front'); setLang((prev: string[])=> prev.filter((l: string) => l && l !== 'node' && l !== 'rust'))}},
                      {txt: mode !== 'assist' ? 'Back-end' : 'API', query: 'back', func: ()=> {setClasses('back'); setLang((prev: string[])=> prev.filter((l: string) => l && l !== 'html' && l !== 'react'))}},
                      {txt: mode !== 'assist' ? 'Full-stack' : 'User interface + API', query: 'full', func: ()=> {setClasses('full'); setLang([])}}
                    ]
                  }}/>
                </div>
              </section>
            </> :
            (service === 'transcript' || service.includes('quality')) ?  <>
              <section>
                <p>About</p>
                <div className={`${style.input} ${style.only}`}>
                  <p>Project concept</p>
                  <ChatInput maxHeight='250px' placeholder={mode === 'assist' ? `Cod-en's objective is to empower businesses by creating a mobile space for them. Users should be able to create projects, edit projects and make payments for project, with CRUD processes for other regular account activities like history, notifications, etc.` : "Your project idea, scopes or prospective task-mangement"} value={concept} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}/>
                </div>
                <div className={`${style.input} ${style.only}`}>
                  <p>About</p>
                  <input type="text" name="about" placeholder={mode === 'assist' ? 'A web development company' : "Describe your project nature"} value={about} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}/>
                </div>
                { service === 'transcript' ? <div className='flex-row-reverse'>
                  <p>Editing-pages count</p>
                  <span className={style.auto} style={pages === 'auto' ? {color: '#2ba12b', opacity: 1} : {}} onClick={()=> setPages((prev: string)=> prev === 'auto' ? '< 5' : 'auto')}>
                  <svg></svg> Auto discover</span>
                  <NewDropSets props={{
                    id: 'pages',
                    listen: true,
                    query: pages,
                    class: style.inView,
                    buttons: [
                      {txt: '< 5', query: '< 5', func: ()=>setPages('< 5')},
                      {txt: '5 - 10', query: '5 - 10', func: ()=>setPages('5 - 10')},
                      {txt: '10 - 20', query: '10 - 20', func: ()=>setPages('10 - 20')},
                      {txt: '20 - 30', query: '20 - 30', func: ()=>setPages('20 - 30')},
                      {txt: '30 +', query: '30 +', func: ()=>setPages('30 +')},
                      {txt: 'Auto -discover ', query: 'auto', func: ()=>{classRemove('#pages', style.inView); Click(`.${style.auto}`) }},
                    ]
                  }}/>
                </div> : <h2 className='flex gap-2.5 flex-wrap whitespace-nowrap pt-5 border-t-[var(--sweetPurple)] border-t-2 scales'>
                    <p>Project scale</p>
                    <div className={style.auto} style={scale === 'small' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('small')}>
                      <svg></svg> Small
                    </div>
                    <div className={style.auto} style={scale === 'medium' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('medium')}>
                      <svg></svg> Medium
                    </div>
                    <div className={style.auto} style={scale === 'large' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('large')}>
                      <svg></svg> Large
                    </div>
                  </h2>}
                <div className={`${style.input} ${style.only}`}>
                  <p>Project name</p>
                  <input type="text" name="project_name" placeholder={mode === 'assist' ? 'Cod-en' : "Your project name or title"} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{setName(e.target.value); (url.trim()=== '' || url.replaceAll('-',' ').replaceAll('.', '').replaceAll('/', '') === name.toLocaleLowerCase()) && mode === 'assist' && setUrl(e.target.value.replaceAll(' ', '-').toLocaleLowerCase())}}/>
                </div>
              </section>
              <section id='integrations'>
                <p>Integrations</p>
                <div id='providers' className='flex-wrap'>
                  <p>Provider</p>
                  <NewDropSets props={{
                    listen: true,
                    id: 'provider',
                    query: provider,
                    class: style.inView,
                    buttons: [
                      {svg: Githubsvg('p-0.5'), txt: 'Github', query: 'github', func: ()=>setProvider('github')}
                    ]
                  }}/>
                  <div className={style.input}>
                    <span>https://github/</span>
                    <input type="text" name="provider" placeholder="your-project-github-repo" value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setUrl(e.target.value.trim().replaceAll('.', ''))}}/>
                    <span>.com</span>
                  </div>
                </div>
                <div id="type">
                  <p>Project type</p>
                  <NewDropSets props={{
                    id: 'types',
                    query: type,
                    listen: true,
                    class: style.inView,
                    buttons: [
                      {txt: 'Full project', query: 'full', func: ()=>{ setType('full')}},
                    ]
                  }}/>
                  <NewDropSets props={{
                    listen: true,
                    id: 'classes',
                    query: classes,
                    class: style.inView,
                    buttons: [
                      {txt: mode !== 'assist' ? 'Front-end' : 'User interface design', query: 'front', func: ()=> {setClasses('front'); setLang((prev: string[])=> prev.filter((l: string) => l && l !== 'node' && l !== 'rust'))}},
                      {txt: mode !== 'assist' ? 'Back-end' : 'API', query: 'back', func: ()=> {setClasses('back'); setLang((prev: string[])=> prev.filter((l: string) => l && l !== 'html' && l !== 'react'))}},
                      {txt: mode !== 'assist' ? 'Full-stack' : 'User interface + API', query: 'full', func: ()=> {setClasses('full'); setLang([])}}
                    ]
                  }}/>
                  </div>
                </section>
              </> : 
              service === 'contract' ? <>
                <section id='features' style={{flexDirection: 'column'}}>
                  <p>Features</p>
                  {features.map((feat: string, i: number)=>(
                    <div className={`${style.input} ${style.only}`} key={i}>
                      <input type="text" placeholder='Enter new project feature' value={feat} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFeatures((prev: string[]) =>[...prev.map((f: string, n: number)=>{return n === i ? e.target.value : f})])} onClick={ () => feat.trim() !== '' && setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== '')])}/>
                    </div>
                  ))}
                  <menu id='add' className={style.special} style={{maxWidth: 'fit-content', placeSelf: 'flex-end'}} onMouseEnter={()=>{classAdd('#add', style.inView); RemoveOtherClass('#add', style.inView, 'menu')}} onClick={()=> classToggle('#add', style.inView)}><span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)'}} onClick={()=>setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), ''])}>{AddSvg()}</span>
                    {(![ 'Blog editor', 'Customer managements','Hosting services', 'Software management'].some((sel: string) => features.includes(sel.trim().toLocaleLowerCase()))) && <div>
                      {['Blog editor', 'Customer managements','Hosting services',  'Software management'].map((sel: string, i: number) => !features.includes(sel) && <span key={i} onClick={()=>setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), sel])}>{sel}</span>)}
                    </div>}
                  </menu>
                </section>
                <section>
                  <p>About</p>
                  <div className={`${style.input} ${style.only}`}>
                    <p>Project concept</p>
                    <ChatInput maxHeight='250px' placeholder={mode === 'assist' ? `Cod-en's objective is to empower businesses by creating a mobile space for them. Users should be able to create projects, edit projects and make payments for project, with CRUD processes for other regular account activities like history, notifications, etc.` : "Your project idea, scopes or prospective task-mangement"} value={concept} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}/>
                  </div>
                  <h2 className='flex gap-2.5 flex-wrap whitespace-nowrap pt-5 border-t-[var(--sweetPurple)] border-t-2 scales'>
                    <p>Project scale</p>
                    <div className={style.auto} style={scale === 'small' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('small')}>
                      <svg></svg> Small
                    </div>
                    <div className={style.auto} style={scale === 'medium' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('medium')}>
                      <svg></svg> Medium
                    </div>
                    <div className={style.auto} style={scale === 'large' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('large')}>
                      <svg></svg> Large
                    </div>
                  </h2>
                  <div>
                    <p>Project sector</p>
                    <NewDropSets props={{
                      query: sec,
                      listen: true,
                      id: 'sector',
                      class: style.inView,
                      buttons: [
                        {txt: 'E-commerce', query: 'e-commerce', func: ()=>{setSec('e-commerce'); setSector('e-commerce')}},
                        {txt: 'Solana', query: 'sol', func: ()=>{setSec('sol'); setSector('sol')}},
                        {txt: 'documentaries', query: 'docs', func: ()=>{setSec('docs'); setSector('docs')}},
                        {txt: 'custom', query: 'custom', func: ()=>{setSec('custom'); setSector('')}}
                      ]
                    }}/>
                    {!sectArr.includes(sector) && <div className={style.input}>
                      <input type="text" name="sector" placeholder='Enter custom sector' value={sector} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setSector(e.target.value.trim()); sectArr.includes(sector) && setSec(e.target.value)}}/>
                    </div>}
                  </div>
                  <div className={`${style.input} ${style.only}`}>
                    <p>About</p>
                    <input type="text" name="about" placeholder={mode === 'assist' ? 'A web development company' : "Describe your project nature"} value={about} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}/>
                  </div>
                  <div className={`${style.input} ${style.only}`}>
                    <p>Project name</p>
                    <input type="text" name="project_name" placeholder={mode === 'assist' ? 'Cod-en' : "Your project name or title"} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{setName(e.target.value); (url.trim()=== '' || url.replaceAll('-',' ').replaceAll('.', '').replaceAll('/', '') === name.toLocaleLowerCase()) && mode === 'assist' && setUrl(e.target.value.replaceAll(' ', '-').toLocaleLowerCase())}}/>
                  </div>
                </section>
                <section id='integrations'>
                  <p>Integrations</p>
                  <div id={style.lang}>
                    <p>Service-term span</p>
                    <div className={rate ? '' : 'text-[rgb(108,102,102)!important]'}>{rate ? FirstCase(rate) : 'Choose service duration'}</div>
                    <NewDropSets props={{
                      id: 'rate',
                      query: rate,
                      listen: true,
                      class: style.inView,
                      buttons: [
                        {txt: 'Yearly', query: 'yearly', func: ()=>setRate('yearly')},
                        {txt: 'Quarterly', query: 'quarterly', func: ()=>setRate('quarterly')},
                        {txt: 'Monthly', query: 'monthly', func: ()=>setRate('monthly')},
                      ]
                    }}/>
                  </div>
                  <div id='providers' className='flex-wrap'>
                    <p>Provider</p>
                    <NewDropSets props={{
                      listen: true,
                      id: 'provider',
                      query: provider,
                      class: style.inView,
                      buttons: [
                        {svg: Githubsvg('p-0.5'), txt: 'Github', query: 'github', func: ()=>setProvider('github')}
                      ]
                    }}/>
                    <div className={style.input}>
                      <span>https://github/</span>
                      <input type="text" name="provider" placeholder="your-project-github-repo" value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setUrl(e.target.value.trim().replaceAll('.', ''))}}/>
                      <span>.com</span>
                    </div>
                  </div>
                </section>
              </> : <>
                <section id='features' style={{flexDirection: 'column'}}>
                  <p>Features</p>
                  {features.map((feat: string, i: number)=>(
                    <div className={style.input} key={i} style={{padding: '20px', borderRadius: '20px', borderBottomLeftRadius: '5px', boxShadow: '0 3px 10px rgb(0, 0, 0 ,0.15)'}}>
                      <input type="text" placeholder='Enter new project feature' value={feat} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setFeatures((prev: string[]) =>[...prev.map((f: string, n: number)=>{return n === i ? e.target.value : f})])} onClick={ () => feat.trim() !== '' && setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== '')])}/>
                    </div>
                  ))}
                  <menu id='add' className={style.special} style={{maxWidth: 'fit-content', placeSelf: 'flex-end'}} onMouseEnter={()=>{classAdd('#add', style.inView); RemoveOtherClass('#add', style.inView, 'menu')}} onClick={()=> classToggle('#add', style.inView)}><span style={{boxShadow: '0 2px 4px rgba(0, 0, 0, 0.282), 0 0px 3px rgba(0, 0, 0, 0.282)'}} onClick={()=> features.length < 2 && setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), ''])}>{AddSvg()}</span>
                    {(![ 'Get domain name', 'Integrate AI','Add payment checkout', 'Add analytics'].some((sel: string) => features.includes(sel.trim().toLocaleLowerCase()))) && <div>
                      {['Get domain name', 'Integrate AI','Add payment checkout',  'Add analytics'].map((sel: string, i: number) => !features.includes(sel) && <span key={i} onClick={()=>setFeatures( (prev: string[]) => [...prev.filter((f: string)=> f.trim() !== ''), sel])}>{sel}</span>)}
                    </div>}
                  </menu>
                </section>
                <section>
                  <p>About</p>
                  <div className={`${style.input} ${style.only}`}>
                    <p>Project concept</p>
                    <ChatInput maxHeight='250px' placeholder={mode === 'assist' ? `    Cod-en's objective is to empower businesses by creating a mobile space for them. Users should be able to create projects, edit projects and make payments for project, with CRUD processes for other regular account activities like history, notifications, etc.` : "Your project idea, scopes or prospective task-mangement"} value={concept} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}/>
                  </div>
                  <h2 className='flex gap-2.5 flex-wrap whitespace-nowrap pt-5 border-t-[var(--sweetPurple)] border-t-2 scales'>
                    <p>Project scale</p>
                    <div className={style.auto} style={scale === 'small' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('small')}>
                      <svg></svg> Small
                    </div>
                    <div className={style.auto} style={scale === 'medium' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('medium')}>
                      <svg></svg> Medium
                    </div>
                    <div className={style.auto} style={scale === 'large' ? {color: '#2ba12b', opacity: 1} : {}} onClick={(e: React.MouseEvent<HTMLDivElement>)=>setScale('large')}>
                      <svg></svg> Large
                    </div>
                  </h2>
                  <div className={`${style.input} ${style.only}`}>
                    <p>About</p>
                    <input type="text" name="about" placeholder={mode === 'assist' ? 'A web development company' : "Describe your project nature"} value={about} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}/>
                  </div>
                  <div className={`${style.input} ${style.only}`}>
                    <p>Project name</p>
                    <input type="text" name="project_name" placeholder={mode === 'assist' ? 'Cod-en' : "Your project name or title"} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{setName(e.target.value); (url.trim()=== '' || url.replaceAll('-',' ').replaceAll('.', '').replaceAll('/', '') === name.toLocaleLowerCase()) && mode === 'assist' && setUrl(e.target.value.replaceAll(' ', '-').toLocaleLowerCase())}}/>
                  </div>
                </section>
                <section>
                  <p>Integrations</p>
                  <div id='providers' className='flex-wrap'>
                    <p>Provider</p>
                    <NewDropSets props={{
                      listen: true,
                      id: 'provider',
                      query: provider,
                      class: style.inView,
                      buttons: [
                        {svg: Githubsvg('p-0.5'), txt: 'Github', query: 'github', func: ()=>setProvider('github')},
                        {svg: ProjectSvg(), txt: 'Projects', query: 'project', func: ()=>{ project.length ? setProvider('project') : setNotify(true); setReason('projects')}}
                      ]
                    }}/>
                    { provider === 'github' ? <div className={style.input}>
                      <span>https://github/</span>
                      <input type="text" name="provider" placeholder="your-project-github-repo" value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setUrl(e.target.value.trim().replaceAll('.', ''))}}/>
                      <span>.com</span>
                    </div> : 
                    <NewDropSets props={{
                      listen: true,
                      id: 'classes',
                      query: classes,
                      class: style.inView,
                      buttons:  [
                        ...project.map((p: projct,  i: number) => {
                          return {txt: p.title, query: p.title, func: ()=>setClasses(p.title)}
                      })]
                    }}/>
                    }
                  </div>
                </section>
              </>}
          </form>
          <form className={style.form} onSubmit={(e: React.FormEvent)=> e.preventDefault()}>
            <h2>Confirm {name ? `${name}'${!name.toLocaleLowerCase().endsWith('s') ? 's' : ''}` : 'project'} details
              <p>Some values are set by default for some service types and may be subject to changes. <Link href='/help/create-project' style={{transition: '0s'}}>Learn more</Link></p>
            </h2>
            <div className={style.confirmer}>
              <div>Project name<span className={style.auto}>{name}</span></div>
              <div>Project type<span className={style.auto}>{FirstCase(type)} project</span></div>
              <div>Project provider<span className={style.auto}>{FirstCase(provider)}</span></div>
              <div>Preferred url<span className={style.auto}>{provider === 'github' ? 'https://github/' : provider === 'domain' ? 'www.' : 'https://'}{FirstCase(url)}{provider === 'vercel' ? `.vercel.app` : '.com'}</span></div>
              <div>About project<span className={style.auto}>{FirstCase(about)}</span></div>
              <div>Project sector<span className={style.auto}>{FirstCase(sector)}</span></div>
              {scale && <div>Project size<span className={style.auto}>{FirstCase(scale)}</span></div>}
              {rate && <div>Term duration<span className={style.auto}>{FirstCase(rate)}</span></div>}
              <div>Project class<span className={style.auto}>{FirstCase(classes.replace('full', 'full stack'))}</span></div>
              {pages && <div>Page-count<span className={style.auto}>{pages.replaceAll('<', 'Less than').replace('30 +', 'More than 30')}</span></div>}
              {lang.length > 0 && <div>Preferred language{lang.length > 1 && 's'}<p className='flex flex-col gap-2.5 flex-1'>{lang.map((l: string, i: number) => <span key={i} className={style.auto}>{FirstCase(l.replace('auto', 'auto detect'))}</span>)}</p></div>}
              {features.length > 0 && <div>Project features<p className='flex flex-col gap-2.5 flex-1'>{features.map((f: string, i: number) => <span key={i} className={style.auto}>{FirstCase(f)}</span>)}</p></div>}
              <div>Service<span className={style.auto}>{FirstCase(service)}</span></div>
            </div>
            <p className={style.error}>{error}</p>
            <menu>
              <button className='bg-[var(--success)]' onClick={(e: React.FormEvent)=>{e.preventDefault(), save()}} disabled={service === ''|| !request || !read || isLoading}>{isLoading ? loaderCircleSvg() : Rocketsvg('BIG')} {isLoading ? 'Finishing...' : 'Finish'}</button>
              <button className='bg-[var(--success)]' onClick={(e: React.FormEvent)=>{e.preventDefault(), setRequest(false)}} disabled={service === '' || !request || isLoading}>{Leftsvg('rotate-180 p-1')} Back</button>
              <span className={style.check} onClick={(e: React.MouseEvent)=>setRead((prev: boolean)=> !prev)} style={read ? {color: '#73a222'} : {}}><svg></svg>I consent to all data provided</span>
            </menu>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default NewProject
