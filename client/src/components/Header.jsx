import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { logout } from '../app/services/userSlice'
import { BsPersonFill, BsFillChatFill } from 'react-icons/bs'
import { MdMenu } from 'react-icons/md'

const Header = ({ id }) => {
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  }

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className='w-full text-gray-900 bg-white z-30 fixed'>
      <div className='w-full md:w-[700px] lg:w-[1000px] px-4 md:px-0 mx-auto h-16 flex justify-between items-center'>
        <h1 className='text-lg font-bold'>
          <Link to='/'>DALL-E</Link>
        </h1>
        {id ?
          <div className='flex flex-col relative' ref={ref}>
            <button onClick={toggleMenu} className='flex gap-2 items-center'>
              <MdMenu fill='#bdbdbd' size={24} />
              <span className='hidden md:block font-semibold'>Menu</span>
            </button>
            {showMenu ?
              <div className='absolute top-[100%] right-0 z-30 bg-white p-2 rounded-lg'>
                <button type='button' className='w-full px-2 py-1 hover:bg-gray-200 rounded-lg'>
                  <Link className='flex gap-2 items-center' to={'/user/' + id}>
                    <BsPersonFill fill='#bdbdbd' size={20} /> Profile
                  </Link>
                </button>
                <button type='button' className='w-full my-2 px-2 py-1 hover:bg-gray-200 rounded-lg'>
                  <Link className='flex gap-2 items-center' to={'/chat'}>
                    <BsFillChatFill fill='#bdbdbd' size={20} /> Chat
                  </Link>
                </button>
                <button type='button' className='mt-2 py-1 px-4 border-2 border-gray-200 hover:bg-gray-200 rounded-lg' onClick={handleLogout}>Logout</button>
              </div> :
              null
            }
          </div> :
          <button type='button' className='mt-2 py-1 px-4 border-2 border-gray-200 hover:bg-gray-200 rounded-lg'>
            <Link to='/login'>Login</Link>
          </button>
        }
      </div>
    </div>
  )
}

export default Header