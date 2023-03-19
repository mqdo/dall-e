import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { useLazyGetAllImageQuery } from '../../app/services/image'
import { Spinner } from '../../utils'

const Feed = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const [getAllImage, { data, isError, isLoading }] = useLazyGetAllImageQuery();

  useEffect(() => {
    if (isError || isLoading) return;

    // define the callback function for IntersectionObserver
    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    // create the IntersectionObserver and attach it to the last image element
    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    const lastImage = document.querySelector('.image:last-child');
    if (lastImage) {
      observer.current.observe(lastImage);
    }
    // fetch the images for the current page and append them to the images state
    getAllImage(page);

    // update the images state based on the server response
    if (data && !data.images.every((el) => images.includes(el))) {
      setImages((prevImages) => [...prevImages, ...data.images]);
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    // cleanup function to disconnect the IntersectionObserver
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [page, isError, hasMore, isLoading]);

  return (
    <div className='w-full py-4'>
      {images.length > 0 ?
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((image, index) => (
            <div key={index} className="image relative">
              <img className='object-contain rounded-lg' src={image.url} alt={image.caption} />
              <div className="absolute top-0 left-0 w-full h-full p-2 bg-gray-800 text-white  text-sm text-center rounded-lg bg-opacity-75 flex flex-col justify-evenly items-center opacity-0 hover:opacity-100 transition-opacity">
                <p className='text-base font-semibold'>{image.caption}</p>
                <Link to={`/image/${image._id}`} class="py-2 px-4 bg-blue-500 text-white rounded-lg">Details</Link>
              </div>
            </div>
          ))}
          {isLoading && <Spinner />}
        </div>
        : <p className='text-center text-lg text-semibold'>{isLoading ? 'Loading' : 'No image was found'}</p>}
    </div>
  );
}

export default Feed;