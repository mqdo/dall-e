import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useGetImageByIdQuery } from '../app/services/image'

const ImageDetail = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const { id } = useParams();

  const { data } = useGetImageByIdQuery(id);

  const image = data?.image;

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 3000);
    }
  }, [copied]);

  return (
    <>
      {children}
      <div className='w-full pt-16 pb-4 md:w-[700px] lg:w-[1000px] px-4 md:px-0 mx-auto'>
        <img src={image?.url} alt={image?.caption} className='w-full object-contain rounded-lg shadow-lg' />
        <p className='py-4 font-semibold'>Author:</p>
        <div className='w-full flex justify-between'>
          <div className='flex gap-2 items-center'>
            <img src={image?.user?.photo} alt={image?.user?.name} className='w-8 h-8 object-contain rounded-full' />
            <p className='font-semibold'>{image?.user?.name}</p>
          </div>
          <div className='flex gap-4 items-center'>
            <CopyToClipboard text={image?.caption} onCopy={() => setCopied(true)}>
              <button className={`py-1 px-3 rounded-lg text-white ${copied ? 'text-gray-900 bg-blue-200' : 'bg-blue-500'}`}>{copied ? 'Prompt copied' : 'Copy prompt'}</button>
            </CopyToClipboard>
            <a className='py-1 px-3 rounded-lg text-white bg-gray-400' href={image?.url} download={image?.caption} target='_blank'>Download</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImageDetail