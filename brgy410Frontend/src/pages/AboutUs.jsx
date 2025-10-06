import React from 'react'
import galingatganda from '../assets/galingatganda.png'
import brgy410logo from '../assets/brgy410.png'

import Navbar from '../components/layout/Navbar'

const AboutUs = () => {
  return (
    <>
        <Navbar />
      <div className='relative'>
        <div className="flex justify-center items-center gap-[30rem] z-0 relative top-40">
          <div className='z-10'>
            <img src={galingatganda} alt="GALING AT GANDA LOGO" width="300" className='z-10 relative' />
          </div>
          <div className='z-10'>
            <img src={brgy410logo} alt="BRGY 410 LOGO" width="225" className='z-10 relative'/>
          </div>
        </div>

        <div className='z-20 absolute top-0 left-0 text-black p-8 border bg-white/20 backdrop-blur-md border-pink-700/30 rounded-4xl shadow-xl m-20 h-100'>
          <div className="p-4 text-center">
            <h2 className='font-bold text-4xl'>
              Our Vision
            </h2>
            <br />
            <p className='text-l'>
              Empowering our residents and building a resilient community where every voice is heard, and every member is valued. We envision a Barangay that thrives on collaboration, embraces diversity, and works collectively towards sustainable growth.
            </p>
            <br />
            <br />
            <h2 className='font-bold text-4xl'>
              Mission Statement
            </h2>
            <br />
            <p className='text-l'>
              The Barangay 410 Portal is dedicated to providing transparent, accessible, and timely information to our residents. Through this digital platform!
              Get Involved! eBarangay 410 Portal thrives when its residents actively participate. Join us on this digital journey towards a more connected and resilient community. Explore the eBarangay 410 Portal, and let's build a future together
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs