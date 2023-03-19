import { createSlice } from '@reduxjs/toolkit';

import { authApi } from './auth';
// import { imageApi } from './image';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: localStorage.getItem('id') || null,
    token: localStorage.getItem('jwt') || null,
    stream: localStorage.getItem('stream') || null,
    name: localStorage.getItem('name') || null,
    photo: localStorage.getItem('photo') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') || false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem('stream');
      localStorage.removeItem('photo');
      localStorage.removeItem('isAuthenticated');
      state.token = null;
      state.id = null;
      state.name = null;
      state.stream = null;
      state.photo = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        localStorage.setItem('jwt', payload.token);
        localStorage.setItem('id', payload.id);
        localStorage.setItem('name', payload.name);
        localStorage.setItem('stream', payload.stream);
        localStorage.setItem('photo', payload.photo);
        localStorage.setItem('isAuthenticated', true);
        state.token = payload.token;
        state.id = payload.id;
        state.name = payload.name;
        state.stream = payload.stream;
        state.photo = payload.photo;
        state.isAuthenticated = true;
      }
    );
    builder.addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        localStorage.setItem('jwt', payload.token);
        localStorage.setItem('id', payload.id);
        localStorage.setItem('name', payload.name);
        localStorage.setItem('stream', payload.stream);
        localStorage.setItem('photo', payload.photo);
        localStorage.setItem('isAuthenticated', true);
        state.token = payload.token;
        state.id = payload.id;
        state.name = payload.name;
        state.stream = payload.stream;
        state.photo = payload.photo;
        state.isAuthenticated = true;
      }
    );
    builder.addMatcher(
      authApi.endpoints.renewToken.matchFulfilled,
      (state, { payload }) => {
        localStorage.setItem('jwt', payload.token);
        // localStorage.setItem('id', payload.id);
        // localStorage.setItem('name', payload.name);
        // localStorage.setItem('email', payload.email);
        // localStorage.setItem('stream', payload.stream);
        // localStorage.setItem('photo', payload.photo);
        // localStorage.setItem('isAuthenticated', true);
        state.token = payload.token;
        // state.id = payload.id;
        // state.name = payload.name;
        // state.email = payload.email;
        // state.stream = payload.stream;
        // state.photo = payload.photo;
        // state.isAuthenticated = true;
      }
    );
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, { payload }) => {
        let message = payload?.data?.message || '';
        if (message === 'Unauthorized') {
          localStorage.removeItem('jwt');
          localStorage.removeItem('id');
          localStorage.removeItem('name');
          localStorage.removeItem('stream');
          localStorage.removeItem('photo');
          localStorage.removeItem('isAuthenticated');
          state.token = null;
          state.id = null;
          state.name = null;
          state.stream = null;
          state.photo = null;
          state.isAuthenticated = false;
        }
      }
    );
  },
});

export const { logout } = userSlice.actions;
export const { reducer: userReducer } = userSlice;
