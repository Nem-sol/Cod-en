import React from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import { ContactForm } from '@/src/components/pageParts'

const Contact = () => {
  return (
    <main className='gap-7 flex flex-col justify-center items-center'>
      <div className={styles.background}></div>
      <form className={styles.formHolder}>
        <h2>Contact form</h2>
        <div className={styles.img}>
          <Image src='/homehero.png' fill={true} alt='contact_img' />
        </div>
        <ContactForm props={styles}/>
        <h3 className={styles.h3}>
          <p><span>Or</span></p>
          <p>Reach out to us: <em></em></p>
        </h3>
      </form>
    </main>
  )
}

export default Contact
