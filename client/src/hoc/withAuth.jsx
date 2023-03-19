import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    useEffect(() => {
      if (!user?.isAuthenticated && !user?.id) {
        navigate('/login');
      }
    }, [user])

    return (
      <WrappedComponent user={user} {...props} />
    )
  }
}

export default withAuth