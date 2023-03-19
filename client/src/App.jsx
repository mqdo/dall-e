import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import useWindowFocus from 'use-window-focus'

import { Header, Login, Signup, Profile, Home, Error, ImageDetail } from './components'
import { useRenewTokenQuery } from './app/services/auth'

const App = () => {
  const user = useSelector((state) => state.user);
  const isWindowFocused = useWindowFocus();

  const { data } = useRenewTokenQuery({}, { pollingInterval: isWindowFocused ? 7200000 : undefined });

  return (
    <>
      <Routes>
        <Route path='/' element={
          <Home>
            <Header id={user?.id} />
          </Home>
        } />
        <Route
          path='/user/:id'
          element={
            <Profile>
              <Header id={user?.id} />
            </Profile>
          }
        />
        <Route
          path='/image/:id'
          element={
            <ImageDetail>
              <Header id={user?.id} />
            </ImageDetail>
          }
        />
        <Route
          path='/signup'
          element={
            <Signup />
          }
        />
        <Route
          path='/login'
          element={
            <Login />
          }
        />
        <Route path='/*' element={<Error />} />
      </Routes>
    </>
  )
}

export default App