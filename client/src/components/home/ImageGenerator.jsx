import React, { useState } from 'react'

import { Spinner, Toast, randomPrompt } from '../../utils'

const ImageGenerator = ({ setImage, generateImage, id }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(false);
    if (!prompt) return;
    const query = {
      prompt: prompt,
      id: id
    }
    try {
      setLoading(true);
      let image = await generateImage(query).unwrap();
      setImage(image);
      setSuccess('Image created successfully');
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  const handleKeyTab = (e) => {
    if (prompt) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      setPrompt(e.target.placeholder);
    }
  };

  const handleGenerateRandomPrompt = () => {
    const random = randomPrompt(prompt);
    setPrompt(random);
  }

  const handleCloseToast = () => {
    setError('');
    setSuccess('');
    setLoading(false);
  }

  return (
    <div className='w-full'>
      {error ?
        <Toast message={error} onClose={handleCloseToast} /> : null
      }
      {success ?
        <Toast message={success} type='success' onClose={handleCloseToast} /> : null
      }
      <div className='w-full py-2 flex gap-2 items-center'>
        <p>Start with a detailed description</p>
        <button className='bg-gray-200 hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold' onClick={handleGenerateRandomPrompt}>Surprise me</button>
      </div>
      <form className='w-full' onSubmit={handleGenerateImage}>
        <input
          className='w-full md:w-5/6 border-2 border-r-0 border-gray-200 outline-gray-200 px-4 py-2 rounded-l-lg'
          value={prompt}
          placeholder={randomPrompt('')}
          onKeyDown={handleKeyTab}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type='submit' className='w-full md:w-1/6 bg-gray-200 hover:bg-gray-100 border-2 border-l-0 border-gray-200 p-2 rounded-r-lg'>
          Generate
        </button>
      </form>
      {loading ?
        <Spinner /> : null
      }
    </div>
  )
}

export default ImageGenerator