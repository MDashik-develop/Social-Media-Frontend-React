// 'use client'
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Twitter, LoaderCircle, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
   // State management
   const [user, setUser] = useState({ name: '', email: '', password: '', confirmPassword: '' });
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   //axios
   const baseUrl = 'http://127.0.0.1:8000/api/auth/';
   const http = axios.create({
      baseURL: baseUrl,
      headers: {
         'Content-Type': 'application/json',
      }
   })
   const navigate = useNavigate();

   // Handle Register Logic
   const handleRegister = (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      // Basic validation
      if (!user.name || !user.email || !user.password || !user.confirmPassword) {
         setError('Please fill in all fields');
         setIsLoading(false);
         return;
      }

      if (user.password !== user.confirmPassword) {
         setError('Passwords do not match');
         setIsLoading(false);
         return;
      }

      if (user.password.length < 6) {
         setError('Password must be at least 6 characters');
         setIsLoading(false);
         return;
      }

      const postData = {
         name: user.name,
         email: user.email,
         password: user.password,
         password_confirmation: user.confirmPassword,
      };
      http.post('/register', postData)
         .then((res) => {
            setIsLoading(false)
            navigate('/login', { replace: true });
         })
         .catch(err => {
            setIsLoading(false);
            if (err.response && err.response.status === 422) {
               const validationErrors = err.response.data.errors;
               const messages = Object.values(validationErrors).flat().join(' ');
               setError(messages); // UI তে দেখাবে
            } else if (err.response && err.response.data.message) {
               setError(err.response.data.message); // UI তে দেখাবে
            } else {
               setError('Something went wrong'); // UI তে দেখাবে
            }
         });
   };
   return (
      <>
         <div className="min-h-screen w-full flex bg-white font-sans text-slate-800">

            {/* LEFT SIDE: Branding & Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 text-white">
               {/* Background Patterns */}
               <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                  <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
               </div>

               {/* Brand Logo Area */}
               <div className="relative z-10">
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                        </svg>
                     </div>
                     SocialSphere
                  </h1>
               </div>

               {/* Testimonial / Hero Text */}
               <div className="relative z-10 max-w-md">
                  <h2 className="text-4xl font-bold mb-6">Join our community today.</h2>
                  <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                     "SocialSphere allows me to connect with people who share my interests. It's the best platform for creators."
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-2">
                        <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=12" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=15" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-indigo-600" src="https://i.pravatar.cc/100?img=18" alt="User" />
                     </div>
                     <span className="text-sm font-medium">Join 2M+ users today</span>
                  </div>
               </div>

               {/* Footer Copyright */}
               <div className="relative z-10 text-indigo-200 text-sm">
                  &copy; 2024 SocialSphere Inc. All rights reserved.
               </div>
            </div>

            {/* RIGHT SIDE: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto h-screen">
               <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl lg:shadow-none lg:bg-transparent lg:p-0 my-auto">

                  {/* Form Header */}
                  <div className="text-center lg:text-left">
                     <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
                     <p className="mt-2 text-sm text-gray-600">
                        Start your 30-day free trial. No credit card required.
                     </p>
                  </div>

                  {/* Social Register Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                     <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Chrome className="w-5 h-5 text-gray-700" />
                     </button>
                     <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Twitter className="w-5 h-5 text-blue-400" />
                     </button>
                     <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Github className="w-5 h-5 text-gray-900" />
                     </button>
                  </div>

                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white lg:bg-gray-50 px-2 text-gray-500">Or sign up with email</span>
                     </div>
                  </div>

                  {/* Register Form */}
                  <form className="mt-8 space-y-5" onSubmit={handleRegister}>

                     {/* Error Message */}
                     {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2 animate-pulse">
                           <span className="block w-1.5 h-1.5 bg-red-500 rounded-full" />
                           {error}
                        </div>
                     )}

                     {/* Name Field */}
                     <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type="text"
                              name="name"
                              value={user.name}
                              onChange={(e) => setUser({ ...user, name: e.target.value })}
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 focus:bg-white"
                              placeholder="John Doe"
                           />
                        </div>
                     </div>

                     {/* Email Field */}
                     <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={(e) => setUser({ ...user, email: e.target.value })}
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 focus:bg-white"
                              placeholder="name@company.com"
                           />
                        </div>
                     </div>

                     {/* Password Field */}
                     <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={user.password}
                              onChange={(e) => setUser({ ...user, password: e.target.value })}
                              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 focus:bg-white"
                              placeholder="Create a password"
                           />
                           <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? (
                                 <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                              ) : (
                                 <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                              )}
                           </button>
                        </div>
                     </div>

                     {/* Confirm Password Field */}
                     <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Confirm Password</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={user.confirmPassword}
                              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 focus:bg-white"
                              placeholder="Confirm your password"
                           />
                           <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           >
                              {showConfirmPassword ? (
                                 <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                              ) : (
                                 <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                              )}
                           </button>
                        </div>
                     </div>

                     {/* Checkbox */}
                     <div className="flex items-center">
                        <input
                           id="terms"
                           name="terms"
                           type="checkbox"
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                           I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                        </label>
                     </div>

                     {/* Submit Button */}
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                     >
                        {isLoading ? (
                           <div className="flex items-center gap-2">
                              <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                              Creating account...
                           </div>
                        ) : (
                           <div className="flex items-center gap-2">
                              Create account
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                           </div>
                        )}
                     </button>
                  </form>

                  {/* Sign In Link */}
                  <div className="text-center mt-6">
                     <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                           Log in
                        </a>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Register