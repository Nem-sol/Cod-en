import React from 'react'
import { HomeLink , year } from './pageParts'
import Link from 'next/link'
import { Facebooksvg, Githubsvg, Xsvg, Youtubesvg } from './svgPack'

const Footer = () => {
  return (
    <footer className='footer'>
      <div style={{ gap: '5px', fontSize: '16px', alignItems: 'start', flexDirection: 'column', minWidth: 'fit-content'}}>
        <HomeLink><h1>Cod-<em className="short_logo">en+</em></h1></HomeLink>
        <span>Copyright {year}</span>
      </div>
      <div className="min-h-9">
        <a href="https://github.com/Nem-sol/Cod-en" target="blank">{Githubsvg('BIG')}</a>
        <a href="" target="blank">{Xsvg('p-1')}</a>
        <a href="" target="blank">{Youtubesvg()}</a>
        <a href="" target="blank">{Facebooksvg()}</a>
        <Link href='/help/policy' className="l">Terms and Policy</Link>
      </div>
    </footer>
  )
}

export default Footer
