// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getJwtToken = () => localStorage.getItem('jwt');

// Define a service using a base URL and expected endpoints
export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
    prepareHeaders: (headers) => {
      const token = getJwtToken();
      if (token) {
        headers.set('Authorization', 'Bearer ' + token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generateImage: builder.mutation({
      query: (data) => ({
        url: 'image/generate',
        method: 'POST',
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: (data) => ({
        url: 'image/upload',
        method: 'POST',
        body: data,
      }),
    }),
    getImageById: builder.query({
      query: (id) => `image/detail/${id}`,
    }),
    getAllImage: builder.query({
      query: (page) => `image/all?page=${page}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGenerateImageMutation,
  useUploadImageMutation,
  useGetImageByIdQuery,
  useLazyGetAllImageQuery,
} = imageApi;
