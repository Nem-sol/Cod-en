'use client'

//Functions to be exported into other pages
//Note:  This is not a next file!

export const pick = focus => document.querySelector(focus)
export const Add = (e, focus) => e.target.classList.add(focus)
export const pickAll = focus => document.querySelectorAll(focus)
export function hide(focus){
  pick(focus).style.display = "none"
}
export function FirstCase(focus){
  const a = typeof(focus[0]) === 'string' ? focus[0].toLocaleUpperCase() : focus[0] || ''
  const b = focus.toLocaleLowerCase().slice(1)
  return `${a}${b}`
}
export function toggle(focus, showForm='block'){
  (pick(focus) && pick(focus).style.display === showForm) ? pick(focus).style.display = "none" : pick(focus).style.display = showForm
}
export function Click(focus){
  pick(focus) && pick(focus).click() 
}
export function classRemove(focus, newClass){
  let factor = pick(focus)
  pick(focus) && factor.classList.remove(newClass)
}
export function classAdd(focus, newClass){
  let factor = pick(focus)
  pick(focus) && factor.classList.add(newClass)
}
export function classToggle(focus, factorclass = 'isShown'){
  let factor = pick(focus)
  if(pick(focus)){
    if (factor.classList.contains(factorclass)){
      factor.classList.remove(factorclass)
    }
    else{
      factor.classList.add(factorclass)
    }
  }
}
export function translateText(text, factor){
  let y = pick(factor)
  if ( !y ) return
  y.innerText = text
}
export function animationTimeline(factor, focusclass, distance, focus= factor){
    let scrolltop = window.scrollY
    let scrolltracker = pick('html').offsetHeight + distance - window.innerHeight - scrolltop
    let topping = factor.offsetTop
    let screenbottom = pick('html').offsetHeight - topping
    if (scrolltracker <= screenbottom){
      focus.classList.add(focusclass)
  }
}
export function RemoveOtherClass( protect, focusClass, targetClass){
  let protectedObj= pick(protect)
  let focusArray = document.querySelectorAll(targetClass)
  //remove special class from similar item in the DOM
  focusArray.forEach((i)=>{
    if ( i !== protectedObj) i.classList.remove(focusClass)
  })
}
export function RemoveLikeClass(e, focusClass, targetClass){
  let insideFocus = false
  let focusArray = document.querySelectorAll(targetClass)
  // Check if the target has the desired class attributes
  focusArray.forEach((i)=>{
    if(e.target === i){ return insideFocus = true}
  })
  //remove special class from similar item in the DOM
  if (insideFocus){
    focusArray.forEach((i)=>{
      if (e.target !== i) i.classList.remove(focusClass)
    })
  }
}
export function AddLikeClass(e, focusClass, targetClass){
  let insideFocus = false
  let focusArray = document.querySelectorAll(targetClass)
  // Check if the target has the desired class attributes
  focusArray.forEach((i)=>{
    if(e.target === i){ return insideFocus = true}
  })
  //remove special class from similar item in the DOM
  if (insideFocus){
    focusArray.forEach((i)=>{
      if (e.target !== i){i.classList.add(focusClass)}
    })
  }
}
export function CheckIncludes( e, focusClass ){
  let verified = false
  let focusArray = pickAll(focusClass)
  focusArray.forEach((i)=> {
    if(e.target === i){return verified = true}
  })
  return verified
}
export function RemoveAllClass( focusClass, targetClass){
  let focusArray = pickAll(targetClass)
  //remove all class from similar item in the DOM
  focusArray.forEach( i => i.classList.remove(focusClass))
}
export function revAnimationTimeline(factor, focusclass, top = 0, bottom = top , focus = factor){
    const end = window.innerHeight - bottom
    const scrolltracker = factor.getBoundingClientRect().y
    if (scrolltracker > top){
      focus.classList.remove(focusclass)
    } else if (scrolltracker <= top && scrolltracker > end ){
      focus.classList.add(focusclass)
    }
    else if (scrolltracker <= end ){
      focus.classList.remove(focusclass)
    }
}
export const scrollCheck = (focus, parent, ancestor = parent) => {
  const par = pick(`.${parent}`)
  const anc = pick(`#${ancestor}`)
  const focal = pick(`.${focus}`)
  if (!anc || !par || !focal) return
  const b = par.offsetTop
  const a = anc.offsetTop
  const topH = a + b
  const scrollH = window.scrollY
  const parentH = par.offsetHeight
  const focusH = focal.offsetHeight
  const parstyles = window.getComputedStyle(par)
  const focalstyles = window.getComputedStyle(focal)
  const padTop = parseInt(focalstyles.paddingTop)
  const padDown = parseInt(focalstyles.paddingBottom)
  const parpadDown = parseInt(parstyles.paddingBottom)
  const excess = ( padTop + padDown ) / 2 + parpadDown
  const spacing = Math.abs(window.innerHeight - focusH) / 2
  const top = scrollH - topH - spacing - focusH + excess + window.innerHeight
  if ( top > 0 && top <= parentH - focusH - excess){
    focal.style.top = `${top}px`
    focal.style.position = 'relative'
  } else  top < 0 ? focal.style.top = '0px' : focal.style.top = `${parentH - focusH - excess}px`
}