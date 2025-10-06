import { React } from 'react'
import Navbar from '../components/layout/Navbar'
import galingatganda from '../assets/galingatganda.png'
import brgy410logo from '../assets/Barangaylogo.svg'

import brgycouncil from '../assets/BrgyCouncil.png'


const Homepage = () => {

  return (
    <div className='min-h-screen'>
      <Navbar />
        <div className="relative w-full min-h-screen">
        {/* Header Text */}
        <div className="mx-auto w-full text-center mt-30 mb-10 text-6xl font-bold">
          <h1 className="text-base-300 ">WELCOME TO</h1>
          <h1 className="text-secondary">BARANGAY 410 ZONE 42</h1>
        </div>

        {/* Logos */}
        <div className="flex justify-center items-center gap-[20rem]">
          <div>
            <img src={galingatganda} alt="GALING AT GANDA LOGO" width="256" />
          </div>
          <div>
            <img src={brgy410logo} alt="BRGY 410 LOGO" width="160" />
          </div>
        </div>

        {/* Bottom Image */}
        <footer className="absolute bottom-0 w-full">
          <div className="w-full">
            <img src={brgycouncil} alt="" className='w-full' />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Homepage;