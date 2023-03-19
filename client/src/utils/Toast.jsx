import React from 'react'

import { AiOutlineCloseCircle } from 'react-icons/ai'

const Toast = ({ message, type, onClose }) => {
  const handleClick = () => {
    onClose();
  };

  return (
    <div className='absolute bottom-10 left-[50%] -translate-x-[50%]'>
      <div className='shadow-lg rounded-md px-8 py-4 grid place-items-center bg-white'>
        <p className={type === 'error' ? 'text-red-500' : 'text-green-500'}>{message}</p>
      </div>
      <button className='absolute -top-2 -right-2 bg-white rounded-full' onClick={handleClick}>
        <AiOutlineCloseCircle fill='#999' size={20} />
      </button>
    </div>
  );
};

export default Toast;
