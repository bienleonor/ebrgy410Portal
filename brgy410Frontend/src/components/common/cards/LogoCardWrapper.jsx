import React from 'react'
import Card from  '../cards/Card';
import GalingAtGandaLogo from '../../../assets/galingatganda.png'


export const LogoCardWrapper = ({ children, className = "" }) => {
  return (
    <Card
      className={`
        relative overflow-hidden rounded-2xl p-8
        bg-white/70 backdrop-blur-xl
        border border-white/30
        shadow-[0_8px_32px_0_rgba(255,182,193,0.35)]
        before:absolute before:inset-0
        before:bg-gradient-to-br before:from-white/50 before:via-pink-200/30 before:to-rose-300/20
        before:rounded-2xl before:-z-10
        ${className}
      `}
    >
      {/* Perfectly centered background logo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={GalingAtGandaLogo}
          alt="Galing at Ganda"
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[60%] max-w-[800px] h-auto
            object-contain opacity-15
          "
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 text-gray-800">
        {children}
      </div>
    </Card>
  );
};

export default LogoCardWrapper;