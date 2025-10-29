import { Padlocksvg, UnlockSvg } from "./svgPack";
import { useRef, useEffect, useState } from "react";

export const PasswordInput = ({ value , classes , onChange , placeholder = 'Enter Password' ,  style = {}}) => {
  const [ type , setType ] = useState('password')
  return <div className={classes}>
    <input type={type} value={value} placeholder={placeholder} onChange={onChange} style={{...style, paddingRight: '30px'}} autoComplete="true" autoCorrect="true" name="password"/>
    <span onClick={()=> setType( prev => prev === 'password' ? 'text' : 'password' )} style={{ top: 'calc(50% - 15px)', left: 'auto', padding: '0', right: '12px', color: 'inherit', cursor: 'pointer', boxShadow: 'none', position: 'absolute', backgroundColor: 'transparent'}}>
      {type === 'password' ? UnlockSvg('BIG') : Padlocksvg('BIG')}
    </span>
  </div>
}
export default function ChatInput({ value , maxHeight = '150px', onChange , placeholder = 'Start new message'}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"// 200px = max-height
  }, [value]);

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
