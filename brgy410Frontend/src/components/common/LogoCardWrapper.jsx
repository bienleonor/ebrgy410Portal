import React from 'react'
import Card from '../common/Card';
import GalingAtGandaLogo from '../../assets/galingatganda.png'

export const LogoCardWrapper = ({ children, className }) => {
  return (
    <Card
      className={`
        bg-white/50
        backdrop-blur-lg
        shadow-2xl
        border-3 border-white/60
        rounded-2xl
        p-8
        relative overflow-hidden
        ${className}
      `}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={GalingAtGandaLogo}
          alt="Galing at Ganda"
          className="absolute top-1/2 left-1/2 w-200 h-auto transform -translate-x-1/2 -translate-y-1/2 opacity-15"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};