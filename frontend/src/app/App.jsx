
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Router } from './app.routes.jsx'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

const App = () => {

  const auth = useAuth()

  useEffect(()=>{
    auth.handleGetMe()
  },[])

  return (
    <div>
      <RouterProvider router={Router}></RouterProvider>
    </div>
  )
}

export default App
