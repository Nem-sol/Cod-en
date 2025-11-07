import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css'
import Footer from '../components/Footer';
import { Buildsvg, Linksvg } from '../components/svgPack';
import { HomeHero, LanguageHero, ServiceHero, FeaturesBanner, Trigger } from '../components/pageParts';

export default function Home() {
  return (
    <main className='gap-[50px] flex flex-col' style={{fontSize: '14px', overflow: 'hidden'}}>
      <HomeHero props={{class: styles.hero, background: styles.background, img: styles.img}} />
      <LanguageHero props={ styles }/>
      <ServiceHero props={ styles }/>
      <section className={styles.set}>
        <h2>
          <span> <span>{Buildsvg('min-w-10 min-h-10')}</span> Our Features?</span>
          <p>Know what makes us better.</p>
        </h2>
        <Link href='/portfolio' className={styles.a}> View coden features {Linksvg('isBIg')}</Link>
        <FeaturesBanner props={ styles }/>
      </section>
      <div id={styles.trigger}>
        <div className={styles.img} style={{flex: 0, minWidth: '250px'}}>
          <Image src='/homehero.png' fill={true} alt='banner_img'/>
        </div>
        <Trigger props={ styles }/>
      </div>
      <Footer />
    </main>
  );
}
