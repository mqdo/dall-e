import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Toast } from '../utils'
import { useLoginMutation } from '../app/services/auth'
import { MdEmail, MdLock } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, loginStatus] = useLoginMutation();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    };
    setLoading(true);
    try {
      const query = {
        email: email,
        password: password
      };
      await login(query).unwrap();
      setEmail('');
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
      <div className='w-full sm:hidden p-4 flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold'>Login</h2>
        <form className='flex flex-col gap-8' onSubmit={handleLogin}>
          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Email' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdEmail fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Password' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdLock fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div>
              <input type='checkbox' id='showPassword-1' className='hidden' onChange={handleShowPassword} />
              <label className='flex gap-2 items-center justify-end' htmlFor='showPassword-1'>{showPassword ?
                <AiOutlineEye fill='#bdbdbd' size={20} /> :
                <AiOutlineEyeInvisible fill='#bdbdbd' size={20} />} Show Password
              </label>
            </div>
          </div>
          <button type='submit' className='py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='flex flex-col items-center gap-8 text-gray-400'>
          <p>Don't have an account yet? <Link to='/signup' className='text-blue-500 hover:text-blue-600'>Register</Link></p>
        </div>
      </div>
      <div className='hidden sm:flex flex-col w-[500px] mx-auto border-gray-200 border-2 rounded-lg px-14 py-8 gap-8'>
        <h2 className='text-3xl font-semibold py-4'>Login</h2>
        <form className='flex flex-col gap-8' onSubmit={handleLogin}>
          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Email' />
              <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdEmail fill='#bdbdbd' size={20} />
              </div>
            </div>
            <div className='relative'>
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Password' />
              <button className='absolute left-3 top-[50%] -translate-y-[50%]'>
                <MdLock fill='#bdbdbd' size={20} />
              </button>
            </div>
          </div>
          <div>
            <input type='checkbox' id='showPassword-2' className='hidden' onChange={handleShowPassword} />
            <label className='flex gap-2 items-center justify-end' htmlFor='showPassword-2'>{showPassword ?
              <AiOutlineEye fill='#bdbdbd' size={20} /> :
              <AiOutlineEyeInvisible fill='#bdbdbd' size={20} />} Show Password
            </label>
          </div>
          <button type='submit' className='py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='flex flex-col items-center gap-6 text-gray-400'>
          <p>Don't have an account yet? <Link to='/signup' className='text-blue-500 hover:text-blue-600'>Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login