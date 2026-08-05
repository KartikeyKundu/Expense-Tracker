"use client"
import { signIn } from 'next-auth/react'
import React, { ReactNode } from 'react'

const LoginBtn = ({ children, provider }: {children: ReactNode, provider: string}) => {
  return (
    <button 
      onClick={()=>{signIn(provider, { callbackUrl: "/"})}} 
      className='bg-slate-900 text-white w-64 h-12 rounded-lg font-medium tracking-wide hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg hover:cursor-pointer active:scale-[0.98] transition-all duration-200 ease-out'
    >
      {children}
    </button>
  )
}

export default LoginBtn