import React from 'react'
import Card from '../common/Card';
import GalingAtGandaLogo from '../../assets/galingatganda.png'

export const LogoCardWrapper = ({ children, className }) => {
  return (
    <Card className={`bg-gradient-to-br from-white to-gray-100 p-8 z-0 relative ${className}`}>
        <img src={GalingAtGandaLogo} alt="Galing at Ganda" className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-200 h-auto opacity-30'/>
        <div className="pt-24 z-10 relative">{children}</div>
    </Card>
  )
}
