import { useRef, useEffect } from "react";

export default function ChatInput({ value , onChange , placeholder = 'Start new message'}) {
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
        maxHeight: "150px",
      }}
    />
  );
}
