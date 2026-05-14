
import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Login = () => {
  
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const user = useSelector(state=> state.auth.user)
  const loading = useSelector(state=> state.auth.loading)


  const navigate = useNavigate()
  const { handleLogin } = useAuth()


  // Form submission handler
  const handleSubmit = async(e) => {
    e.preventDefault()
    
    const payload = {
      email,
      password
    }

   try{ 
    
    await handleLogin(payload)

}catch(error){
  console.error(error);
  toast.error(
    error?.response?.data?.message || "Login failed"
  );
}
    
navigate('/')
  }
if(!loading && user){
      return <Navigate to='/' />
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              required
              onChange={(e)=>{setemail(e.target.value)}}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
              }`}
            />
        
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(e)=>{setpassword(e.target.value)}}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
              }`}
            />
            
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
