import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLazyGetUserByIdQuery, useUpdateUserByIdMutation } from '../app/services/auth';

import { MdEmail, MdLock } from 'react-icons/md'
import { BsPersonFill } from 'react-icons/bs'
import { BiDetail } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import withAuth from '../hoc/withAuth'
import { Toast } from '../utils';

const Profile = ({ user: { id }, children }) => {
  const { id: pathId } = useParams();
  const navigate = useNavigate();

  const [getUser, { data, isError: error, isLoading }] = useLazyGetUserByIdQuery();

  useEffect(() => {
    getUser(id);
    if (pathId !== id) {
      navigate('/error');
    }
  }, [id]);

  const user = useMemo(() => {
    if (!error && !isLoading) return data?.data?.user;
  }, [data, error, isLoading]);

  const [update, updateStatus] = useUpdateUserByIdMutation();

  const [photo, setPhoto] = useState(user?.photo || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(error?.data?.message || '');
  const [isSuccess, setIsSuccess] = useState('');

  const handlePhotoChange = (e) => {
    const selectedImage = e.target.files[0];
    setPhotoFile(e.target.files[0]);
    setPhoto(URL.createObjectURL(selectedImage));
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      setIsError('Old password is required');
      return;
    }
    if (!email) {
      setIsError('An Email is required');
      return;
    }
    const formData = new FormData();
    const password = {
      old: oldPassword,
      new: newPassword
    };
    formData.append('password', JSON.stringify(password));
    formData.append('email', email);
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    if (bio) {
      formData.append('bio', bio);
    }
    if (name) {
      formData.append('name', name);
    }
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    try {
      await update({ data: formData, id }).unwrap();
      getUser(id);
      setIsSuccess('Update successfully');
    } catch (err) {
      setIsError(err.data?.message);
    }
  }

  const handleReset = () => {
    getUser(id);
    setPhoto(user?.photo || '');
    setName(user?.name || '');
    setBio(user?.bio || '');
    setEmail(user?.email || '');
    setOldPassword('');
    setNewPassword('');
    setIsError('');
    setIsSuccess('');
  }

  useEffect(() => {
    handleReset();
  }, [data]);

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

  const handleCloseToast = () => setIsError('');

  useEffect(() => {
    if (isError?.length === 0) return;
    const timeout = setTimeout(() => setIsError(''), 2000);
    return () => clearTimeout(timeout);
  }, [isError])

  useEffect(() => {
    if (isSuccess?.length === 0) return;
    const timeout = setTimeout(() => setIsSuccess(''), 2000);
    return () => clearTimeout(timeout);
  }, [isSuccess])

  return (
    <>
      {children}
      <div className='w-full md:w-[700px] lg:w-[1000px] px-4 md:px-0 mx-auto pt-16 flex flex-col gap-8 relative'>
        <h2 className='text-lg md:text-2xl font-semibold'>Personal Info</h2>
        {isError ?
          <Toast message={isError} type='error' onClose={handleCloseToast} /> :
          null
        }
        {isSuccess ?
          <Toast message={isSuccess} type='success' onClose={handleCloseToast} /> :
          null
        }
        <form className='flex flex-col gap-8' onSubmit={handleChange}>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <p className='w-full md:w-1/3 text-gray-500 font-semibold'>Photo: </p>
              <div className='w-full relative'>
                <input type='file' accept='photo/*' id='photo' className='hidden' onChange={handlePhotoChange} />
                <div className='w-40 flex flex-col items-center gap-2'>
                  {photo ?
                    <img src={photo} className='w-full h-40 rounded-full object-cover' alt='profile image' /> :
                    null
                  }
                  <label htmlFor='photo' className='bg-gray-300 hover:bg-gray-200 px-4 py-1 text-gray-700 rounded-lg'>
                    Change photo
                  </label>
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <label htmlFor='email' className='w-full md:w-1/3 text-gray-500 font-semibold'>Email: </label>
              <div className='w-full relative'>
                <input type='email' id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Email' />
                <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                  <MdEmail fill='#bdbdbd' size={20} />
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <label htmlFor='fullname' className='w-full md:w-1/3 text-gray-500 font-semibold'>Fullname: </label>
              <div className='w-full relative'>
                <input type='name' id='fullname' name='fullname' value={name} onChange={(e) => setName(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Fullname' />
                <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                  <BsPersonFill fill='#bdbdbd' size={20} />
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <label htmlFor='bio' className='w-full md:w-1/3 text-gray-500 font-semibold'>Bio: </label>
              <div className='w-full relative'>
                <input type='text' id='bio' name='bio' value={bio} onChange={(e) => setBio(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Bio (optional)' />
                <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                  <BiDetail fill='#bdbdbd' size={20} />
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <label htmlFor='oldPassword' className='w-full md:w-1/3 text-gray-500 font-semibold'>Old password: </label>
              <div className='w-full relative'>
                <input type='password' id='oldPassword' name='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='Old password' />
                <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                  <MdLock fill='#bdbdbd' size={20} />
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start'>
              <label htmlFor='newPassword' className='w-full md:w-1/3 text-gray-500 font-semibold'>New password: </label>
              <div className='w-full relative'>
                <input type='password' id='newPassword' name='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='w-full border-2 border-gray-200 p-2 pl-10 rounded-lg' placeholder='New password (optional)' />
                <div className='absolute left-3 top-[50%] -translate-y-[50%]'>
                  <MdLock fill='#bdbdbd' size={20} />
                </div>
              </div>
            </div>
            <div>
              <input type='checkbox' id='showPassword-2' className='hidden' onChange={handleShowPassword} />
              <label className='flex gap-2 items-center justify-end' htmlFor='showPassword-2'>{showPassword ?
                <AiOutlineEye fill='#bdbdbd' size={20} /> :
                <AiOutlineEyeInvisible fill='#bdbdbd' size={20} />} Show Password
              </label>
            </div>
            <div className='w-full md:w-[450px] mx-auto flex gap-4'>
              <button type='submit' className='w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider'>
                Change
              </button>
              <button type='reset' className='w-full py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-white font-semibold tracking-wider' onClick={handleReset}>
                Cancel
              </button>
            </div>
          </div>
        </form >
      </div >
    </>
  )
}

export default withAuth(Profile)