import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useUploadImageMutation } from '../../app/services/image';
import { Spinner, Toast } from '../../utils';

const ImagePreview = ({ image, setImage, id, generateImage }) => {
  const [uploadImage, status] = useUploadImageMutation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    setLoading(false);
    const formData = new FormData();
    const blob = atob(image.base64);
    const arrayBuffer = new ArrayBuffer(blob.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < blob.length; i++) {
      uint8Array[i] = blob.charCodeAt(i);
    }

    const file = new Blob([arrayBuffer], { type: "image/png" });

    formData.append('id', id);
    formData.append('image', file, `dalle.png`);
    formData.append('prompt', image.prompt);
    // console.log(query);
    try {
      setLoading(true);
      let { id: imageId } = await uploadImage(formData).unwrap();
      // console.log(imageId);
      navigate(`/image/${imageId}`);
      setSuccess('Uploaded image successfully');
    } catch (err) {
      console.error(err);
      setError('Something went wrong uploading');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(false);
    const query = {
      prompt: image.prompt,
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
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setSuccess('');
    setError('');
    setLoading(false);
  };

  return (
    <>
      {image?.base64 ?
        <div className='w-full py-4 flex flex-col items-center gap-4'>
          {error ?
            <Toast message={error} onClose={handleCloseToast} /> : null
          }
          {success ?
            <Toast message={success} type='success' onClose={handleCloseToast} /> : null
          }
          <h2 className='text-lg md:text-2xl font-semibold'>{image?.prompt}</h2>
          <img src={`data:image/jpeg;charset=utf-8;base64,${image?.base64}`} alt={image?.prompt} className='w-full h-auto rounded-lg object-contain shadow-md' />
          <div className='w-full flex gap-2'>
            <button type='submit' className='w-full md:w-[450px] mx-auto py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider' onClick={handleUploadImage}>
              Save this
            </button>
            <button type='submit' className='w-full md:w-[450px] mx-auto py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold tracking-wider' onClick={handleGenerateImage}>
              Try another
            </button>
          </div>
          {loading ?
            <Spinner /> : null
          }
        </div> : null
      }
    </>
  )
}

export default ImagePreview