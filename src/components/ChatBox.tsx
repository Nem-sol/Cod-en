import { Padlocksvg, UnlockSvg } from "./svgPack";
import { useRef, useEffect, useState } from "react";

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
    const el = textareaRef.current;
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"// 200px = max-height
  }, [ value ]);

  return (
    <textarea
      value={value}
      ref={textareaRef}
      onChange={onChange}
      autoCorrect="true"
      autoComplete="true"
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
