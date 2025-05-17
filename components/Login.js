import React, { useState } from 'react';
import { SiUpcloud } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className='grid grid-cols-1'>
      <div className='bg-white h-screen flex flex-col items-center justify-center space-y-6'>
        <SiUpcloud className="text-purple-500 text-[200px]" />
        
        <h1 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-amber-500 italic pb-2'>
          Tangled
        </h1>
        
        {/* Google Sign In */}
        <div 
          className='flex gap-4 bg-gray-200 p-2 px-14 items-center rounded-[6px] cursor-pointer hover:bg-gray-300 transition-colors' 
          onClick={() => signIn('google')}>
          <FcGoogle className='text-[30px]'/>
          <span>Sign in with Google</span>
        </div>
        
        {/* OR Divider */}
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span 
              className="px-2 bg-white text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowCredentialForm(!showCredentialForm)}
            >
              {showCredentialForm ? 'Hide Admin Login' : 'OR'}
            </span>
          </div>
        </div>
        
        {/* JSONPlaceholder Login Form */}
        {showCredentialForm && (
          <form 
            onSubmit={handleCredentialsLogin}
            className="w-full max-w-xs space-y-4"
          >
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password (use username from JSONPlaceholder)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Sign in with JSONPlaceholder
            </button>
            
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;