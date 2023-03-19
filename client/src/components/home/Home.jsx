import React, { useState } from 'react'
import withAuth from '../../hoc/withAuth'
import { useSelector } from 'react-redux'

import Feed from './Feed'
import ImageGenerator from './ImageGenerator'
import ImagePreview from './ImagePreview'
import { useGenerateImageMutation } from '../../app/services/image'

const Home = ({ children }) => {
  const [image, setImage] = useState({});

  const [generateImage, status] = useGenerateImageMutation();


  const { id } = useSelector((state) => state.user);

  return (
    <>
      {children}
      <div className='w-full md:w-[700px] lg:w-[1000px] px-4 md:px-0 mx-auto pt-16 text-gray-900'>
        <ImageGenerator setImage={setImage} generateImage={generateImage} id={id} />
        <ImagePreview image={image} setImage={setImage} generateImage={generateImage} id={id} />
        <Feed />
      </div>
    </>
  )
}

export default withAuth(Home);