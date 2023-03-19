import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Toast } from '../utils'
import { useSignupMutation } from '../app/services/auth'
import { MdEmail, MdLock } from 'react-icons/md'
import { BsPersonFill } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signup, signupStatus] = useSignupMutation();

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullname) {
      setError('Email, fullname and password are required');
      return;
    };
    setLoading(true);
    try {
      const query = {
        email: email,
        name: fullname,
        password: password
      };
      await signup(query).unwrap();
      setEmail('');
      setFullname('');
      setPassword('');
      navigate('/');
    } catch (err) {
      let message = err?.data?.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
    let pwInput = document.querySelectorAll('input[name=password]');
    pwInput.forEach((input) => {
      if (input.type === 'password') {
        input.type = 'text';
      } else {
        input.type = 'password';
      }
    })
  };

  const handleCloseToast = () => setError('');

  useEffect(() => {
    if (error?.length === 0) return;
    const timeout = setTimeout(() => setError(''), 2000);
    return () => clearTimeout(timeout);
  }, [error])

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-8 text-gray-900'>
      {error?.length > 0 ?
        <Toast message={error} type='error' onClose={handleCloseToast} /> :
        null
      }
      <div className='w-full sm:hidden p-4 flex flex-col gap-6'>
        <h2 className='text-2xl font-semibold'>Sign up</h2>
        <form className='flex flex-col gap-8' onSubmit={handleSignup}>
          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Email' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdEmail fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='name' name='fullname' value={fullname} onChange={(e) => setFullname(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Fullname' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <BsPersonFill fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Password' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdLock fill='#bdbdbd' size={20} />
              </div>
              <div>
                <input type='checkbox' id='showPassword-1' className='hidden' onChange={handleShowPassword} />
                <label className='flex gap-2 items-center justify-end' htmlFor='showPassword-1'>{showPassword ?
                  <AiOutlineEye fill='#bdbdbd' size={20} /> :
                  <AiOutlineEyeInvisible fill='#bdbdbd' size={20} />} Show Password
                </label>
              </div>
            </div>
          </div>
          <button type='submit' className='py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider'>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <div className='pt-4 flex flex-col items-center gap-6 text-gray-400'>
          <p>Already a member? <Link to='/login' className='text-blue-500 hover:text-blue-600'>Login</Link></p>
        </div>
      </div>
      <div className='hidden w-[500px] mx-auto border-gray-200 border-2 rounded-lg px-14 py-8 sm:flex flex-col gap-8'>
        <h2 className='text-3xl font-semibold py-4'>Sign up</h2>
        <form className='flex flex-col gap-8' onSubmit={handleSignup}>
          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Email' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdEmail fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='name' name='fullname' value={fullname} onChange={(e) => setFullname(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Fullname' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <BsPersonFill fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Password' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdLock fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div>
              <input type='checkbox' id='showPassword-2' className='hidden' onChange={handleShowPassword} />
              <label className='flex gap-2 items-center justify-end' htmlFor='showPassword-2'>{showPassword ?
                <AiOutlineEye fill='#bdbdbd' size={20} /> :
                <AiOutlineEyeInvisible fill='#bdbdbd' size={20} />} Show Password
              </label>
            </div>
          </div>
          <button type='submit' className='py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider'>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <div className='flex flex-col items-center gap-6 text-gray-400'>
          <p>Already a member? <Link to='/login' className='text-blue-500 hover:text-blue-600'>Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup