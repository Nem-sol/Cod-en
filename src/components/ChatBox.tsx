import { Padlocksvg, UnlockSvg } from "./svgPack";
import { useRef, useEffect, useState } from "react";
import styles from './../app/projects/[id]/project.module.css'

type PasswordProps = {
  name?: string
  value: string
  classes: string
  placeholder?: string
  style?: { readonly [key: string]: string }
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=> void
}

type ChatProps = {
  value: string
  maxHeight?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>)=> void
}

export const EdittablePack = ({
  text = '' ,
  style = {},
  value = '' ,
  rev = false,
  svg = <></> ,
  editting = false ,
  placeholder = '' ,
  classes = styles.span,
  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => { console.log(e.target.value )},
  onChangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => { console.log(e.target.value )}
}) => {
  if ( !editting ) return <div style={style} className={classes}> { svg } <span> { value } </span> </div>
  else return <div style={style} className={`${classes} ${styles.editting} ${rev ? styles.rev : ''}`}> { svg }
    { rev ? <input value={text} placeholder={placeholder} onChange={onChangeInput}/> : <ChatInput value={text} placeholder={placeholder} onChange={onChangeArea} maxHeight='275px'/>}
  </div>
}

export const PasswordInput = ({
  value ,
  classes ,
  onChange ,
  name="password",
  placeholder = 'Enter Password' , 
  style = {}} : PasswordProps ) => {
  const [ type , setType ] = useState('password')
  return <div className={classes}>
    <input type={type} value={value} placeholder={placeholder} onChange={onChange} style={{...style, paddingRight: '30px'}} autoComplete="true" autoCorrect="true" name={name}/>
    <span onClick={()=> setType( prev => prev === 'password' ? 'text' : 'password' )} style={{ top: 'calc(50% - 15px)', left: 'auto', padding: '0', right: '12px', color: 'inherit', cursor: 'pointer', boxShadow: 'none', position: 'absolute', backgroundColor: 'transparent'}}>
      {type === 'password' ? UnlockSvg('BIG') : Padlocksvg('BIG')}
    </span>
  </div>
}
export default function ChatInput({
  value ,
  onChange ,
  maxHeight = '150px',
  placeholder = 'Start new message'}: ChatProps ) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resize = () => {
      const el = textareaRef.current;
      if (!el) return
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 200) + "px"// 200px = max-height
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [ value ]);

  return (
    <textarea
      value={value}
      ref={textareaRef}
      autoCorrect="true"
      autoComplete="true"
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      style={{
        resize: "none",
        padding: "5px",
        fontSize: "14px",
        lineHeight: "1.5",
        overflowY: "auto",
        maxHeight: maxHeight,
      }}
    />
  );
}
