import React from 'react'
import { Children } from 'react'
import { Navigate } from 'react-router-dom';

function GuestCheckRoute({ children }) {
   const token = localStorage.getItem("token")
   if (token) {
      return <Navigate to="/" replace />
   }
  return children
}

export default GuestCheckRoute