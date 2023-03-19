// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getJwtToken = () => localStorage.getItem('jwt');

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getJwtToken();
      if (token) {
        headers.set('Authorization', 'Bearer ' + token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: 'auth/signup',
        method: 'POST',
        body: data,
      }),
    }),
    getUserById: builder.query({
      query: (id) => `user/${id}`,
    }),
    updateUserById: builder.mutation({
      query: ({ data, id }) => ({
        url: `user/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    renewToken: builder.query({
      query: () => 'auth/renew-token',
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useRenewTokenQuery,
} = authApi;
