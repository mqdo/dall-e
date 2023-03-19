import React from 'react'

import { FaSpinner } from 'react-icons/fa'

const Spinner = ({ theme }) => {
  return (
    <div className='w-full py-4 h-12 grid place-items-center relative'>
      <div className='p-12 mx-auto text-center animate-spin delay-75 absolute'>
        <FaSpinner size={45} fill={theme === 'dark' ? 'hsl(0, 0%, 100%)' : 'hsl(200, 15%, 8%)'} />
        <span className='hidden'>Loading...</span>
      </div>
    </div>
  )
}

export default Spinner