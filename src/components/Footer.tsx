import React from 'react'
import { HomeLink , year } from './pageParts'
import Link from 'next/link'
import { Booksvg, Devsvg, Facebooksvg, Githubsvg, Helpsvg, PortfolioSvg, ResourcesSvg, Rocketsvg, TagSvg, Xsvg, Youtubesvg } from './svgPack'

const Footer = () => {
  return (
    <footer className='footer'>
      <div style={{ gap: '5px', fontSize: '16px', alignItems: 'start', flexDirection: 'column', minWidth: 'fit-content'}}>
        <HomeLink><h1>Cod-<em className="short_logo">en+</em></h1></HomeLink>
        <span>Copyright {year}</span>
      </div>
      <section>
        <div>
          <Link href="/help/terms">Terms</Link>
          <Link href="/help/policies">Policies</Link>
        </div>
        <div>
          <Link href="/portfolio/services">{Devsvg()} Services</Link>
          <Link href="/help/paymennts"> {TagSvg('BIG')} Payments</Link>
          <Link href="/help/faq">{Helpsvg()} FAQs</Link>
          <Link href="/help/tutorials"> {Rocketsvg('p-[2px]')} Tutorials</Link>
          <Link href="/portfolio/projects"> {PortfolioSvg()} Projects</Link>
        </div>
        <div>
          <Link href="/help">{Booksvg('big')} Documentations</Link>
          <Link href="/help/resources">{ResourcesSvg()} Resources</Link>
        </div>
      </section> 
      <div style={{ width: '100%' }}>    
          <Link href="https://github.com/Nem-sol/Cod-en" target="blank">{Githubsvg('BIG')}</Link>
          <Link href="" target="blank">{Xsvg('p-1')}</Link>
          <Link href="" target="blank">{Youtubesvg()}</Link>
          <Link href="" target="blank">{Facebooksvg()}</Link>
        <Link href='/help/policy' className="l">Terms and Policy</Link>
      </div>
    </footer>
  )
}

export function ShortFooter () {
  return (
    <footer className="footer"><div style={{ gap: '5px', fontSize: '16px', alignItems: 'start', flexDirection: 'column', minWidth: 'fit-content'}}>
        <HomeLink><h1>Cod-<em className="short_logo">en+</em></h1></HomeLink>
        <span>Copyright {year}</span>
      </div>
      <div style={{ width: '100%' }}>    
          <Link href="https://github.com/Nem-sol/Cod-en" target="blank">{Githubsvg('BIG')}</Link>
          <Link href="" target="blank">{Xsvg('p-1')}</Link>
          <Link href="" target="blank">{Youtubesvg()}</Link>
          <Link href="" target="blank">{Facebooksvg()}</Link>
        <Link href='/help/policy' className="l">Terms and Policy</Link>
      </div>
    </footer>
  )
}

export default Footer
