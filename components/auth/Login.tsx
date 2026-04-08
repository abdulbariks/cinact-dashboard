'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import Image from 'next/image';
import { UserService } from '@/service/user/user.service';
import { showSuccessToast } from '@/lib/hotToast';
import authImg from '@/public/auth/auth-img.png'; 
import logo from '@/public/auth/logo.png'

const normalizeClientRole = (role?: string): 'admin' | 'tutor' | 'finance' | 'viewer' => {
  if (!role) return 'viewer';

  const currentRole = role.toLowerCase().trim();
  if (currentRole === 'su_admin' || currentRole === 'admin' || currentRole === 'superadmin') {
    return 'admin';
  }
  if (currentRole === 'tutor' || currentRole === 'teacher') {
    return 'tutor';
  }
  if (currentRole === 'finance' || currentRole === 'accountant') {
    return 'finance';
  }
  return 'viewer';
};

const getRedirectPath = (role: 'admin' | 'tutor' | 'finance' | 'viewer'): string => {
  if (role === 'admin') return '/dashboard';
  if (role === 'tutor') return '/tutor-dashboard';
  if (role === 'finance') return '/finance-dashboard';
  return '/';
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await UserService.login({ email, password });
      const apiRes = res?.data;

      if (!apiRes?.success) {
        throw new Error(apiRes?.message || 'Login failed');
      }

      const token = apiRes?.authorization?.access_token;
      const refreshToken = apiRes?.authorization?.refresh_token;
      const apiRole = apiRes?.type;
      const userId = apiRes?.userId;
      const userRole = normalizeClientRole(apiRole);

      if (!token) {
        throw new Error('Access token missing in login response');
      }

      const cookieOptions = {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };

      setCookie(null, 'token', token, cookieOptions);
      setCookie(null, 'accessToken', token, cookieOptions);

      if (refreshToken) {
        setCookie(null, 'refreshToken', refreshToken, cookieOptions);
      }

      setCookie(
        null,
        'user',
        JSON.stringify({
          id: userId,
          email,
          role: userRole,
          apiRole,
        }),
        cookieOptions
      );

      setCookie(null, 'userRole', userRole, cookieOptions);

      showSuccessToast(apiRes?.message || 'Logged in successfully');

      router.push(getRedirectPath(userRole));
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen'>
      {/* Left Side - Full Height Image */}
      <div className='hidden lg:block lg:w-2/5 bg-[#0c1015] relative overflow-hidden'>
        <div className='relative w-full h-full'>
          <Image 
            src={authImg} 
            alt='auth-img' 
            fill
            className='object-cover'
            priority
            sizes='(max-width: 768px) 100vw, 40vw'
          />
         
          
          {/* Optional text overlay */}
          <div className='absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white '>
          <div className=' flex justify-center'>
          <Image src={logo} alt='logo' className=' mb-8'/>

          </div>
            <h2 className='text-3xl font-medium mb-3 text-center'>Welcome to CINACT 🎭</h2>
            <p className='text-[#8C9196] text-center'>Manage classes, students, and faculty in one <br /> secure dashboard.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-black min-h-screen p-4">
        <div className="bg-[#0a1726] p-[30px] rounded-[16px] w-full max-w-[503px] shadow-xl">
          {/* Header */}
          <div className="  mb-8">
            <p className="text-white text-sm ">Hey! Welcome</p>
            <h1 className="text-2xl font-medium text-white mt-4">Login to your Account</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-3   border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-3   border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 bg-[#1a2634] border-gray-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-white hover:text-white/90 text-base font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E9201D] text-white py-4 rounded-lg hover:[#E9201D]/50 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed font-medium mt-6 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}