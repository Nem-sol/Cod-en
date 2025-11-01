'use client'
import React, { useState } from 'react'
import style from './page.module.css'
import styles from './../main.module.css'
import Footer from '@/src/components/Footer'
import stylez from './../contact/page.module.css'


const Tutorials = () => {
  return (
    <main id={styles.main}>
      <div className={stylez.background} ></div>
      <main className={styles.main}>
        <h2 className={styles.title}>{} Tutorials</h2>
      </main>
      <Footer />
    </main>
  )
}

export default Tutorials
