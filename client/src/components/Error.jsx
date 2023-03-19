import React from 'react'
import { Link } from 'react-router-dom'

import { RiEmotionSadLine } from 'react-icons/ri'
import { BiArrowBack } from 'react-icons/bi'

const Error = ({ theme }) => {
  return (
    <main aria-level='alert page' role='alert' className='w-full md:max-w-[1200px] h-[calc(100vh-4rem)] mx-auto px-8 py-16 flex flex-col justify-center items-center text-center gap-6'>
      <RiEmotionSadLine size={200} fill={theme === 'dark' ? 'hsl(0, 0%, 100%)' : 'hsl(200, 15%, 8%)'} />
      <h1 className='text-6xl font-extrabold'>404</h1>
      <p className='text-semibold text-neutral-400 text-2xl'>Page not found</p>
      <span>The page you looking for doesn't exist or some error has occurred</span>
      <span className='text-lg underline'>
        <Link to='/'>
          <span className='flex gap-2 items-center'>
            <BiArrowBack size={16} fill={theme === 'dark' ? 'hsl(0, 0%, 100%)' : 'hsl(200, 15%, 8%)'} />
            Go back to Homepage
          </span>
        </Link>
      </span>
    </main>
  )
}

export default Error