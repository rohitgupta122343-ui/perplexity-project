import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Register = () => {

const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [successMessage, setSuccessMessage] = useState(false)

  // Two-way binding handler
  
 const navigate = useNavigate()
 const { handleRegister } = useAuth()


  // Form submission handler
  
  const handleSubmit = async(e) => {
    e.preventDefault()

    
    if(password.length < 8){
   toast.error("Password must be at least 6 characters long")
   return;
}

try {
  
  const playload = {
  username,
  email,
  password
  }
  await handleRegister(playload);

  setSuccessMessage(true);

  toast.success("Verify email sent");

} catch (error) {
  console.log(error);
  toast.error(
    error?.response?.data?.message || "Registration failed"
  );
}

 

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
       <Toaster position="top-right" />

      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" >

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-gray-700 border rounded-lg outline-none text-white placeholder-gray-400 "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min 6 characters"
              className="w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 outline-none "
            />
          </div>

          {/* Submit Button */}
          <button
  type="submit"
  className={`w-full rounded-2xl py-3 px-4 font-semibold cursor-pointer transition duration-100
  ${
    successMessage
      ? "bg-emerald-500 text-black"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {successMessage ? "✓ Registered, verify sent in email" : "Register"}
</button>

        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Login here
          </a>
        </p>

        <div>
          <p className="mt-6 text-center text-gray-400">
            Didn't get the email? <button onClick={() => console.log('Resend email clicked')} className="text-blue-400 hover:text-blue-300 font-semibold">Resend Email</button>
          </p>
        </div>

      

      </div>
    </div>
  )
}

export default Register