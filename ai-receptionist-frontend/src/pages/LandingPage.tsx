import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // ✅ Option 1: Handle OAuth redirect token in URL
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const token = params.get("token");
  //   if (token) {
  //     localStorage.setItem("token", token);
  //     // Clean URL and go to dashboard
  //     window.history.replaceState({}, "", "/dashboard");
  //     navigate("/dashboard", { replace: true });
  //   }
  // }, [navigate]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("🟢 Token from URL:", token); // Add this line

    if (token) {
      localStorage.setItem("token", token);
      console.log("💾 Token saved to localStorage");
      window.history.replaceState({}, "", "/dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function handleOAuthLogin(provider: string) {
    window.location.href = `${API_BASE}/oauth/login/${provider}`;
  }

  async function handleEmailLogin() {
    try {
      setLoginError('');
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/dashboard'; // redirect after success
      } else {
        const msg = await response.text();
        throw new Error(msg || 'Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.message);
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-6'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>
        AI Receptionist Portal
      </h1>
      <p className='text-gray-600 mb-8 max-w-md'>
        Automate your appointment scheduling and stay connected effortlessly.
      </p>

      {/* CTA Buttons */}
      <div className='flex space-x-4'>
        <button
          onClick={() => setShowLogin(true)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition'
        >
          Login
        </button>
        <button
          onClick={() => setShowSignup(true)}
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition'
        >
          Sign Up
        </button>
      </div>

      {/* ===== LOGIN MODAL ===== */}
      {showLogin && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-2xl shadow-xl p-8 w-96 relative'>
            <button
              onClick={() => setShowLogin(false)}
              className='absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg'
            >
              ✕
            </button>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Login</h2>

            {/* OAuth Buttons */}
            <div className='flex justify-center gap-3 mb-5'>
              <button
                onClick={() => handleOAuthLogin("google")}
                className='flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50'
              >
                <img
                  src='https://developers.google.com/identity/images/g-logo.png'
                  alt='Google'
                  className='w-5 h-5'
                />
                Google
              </button>
              <button
                onClick={() => handleOAuthLogin("microsoft")}
                className='flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700'
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
                  alt='Microsoft'
                  className='w-5 h-5 bg-white rounded-sm'
                />
                Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className='flex items-center gap-2 mb-5'>
              <div className='flex-1 h-px bg-gray-300'></div>
              <span className='text-sm text-gray-500'>or</span>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>

            {/* Email Login */}
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className='border rounded-lg w-full px-3 py-2 mb-3 focus:outline-blue-500'
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='border rounded-lg w-full px-3 py-2 mb-4 focus:outline-blue-500'
            />

            {loginError && (
              <p className='text-red-600 text-sm mb-3'>{loginError}</p>
            )}

            <button
              onClick={handleEmailLogin}
              className='bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700'
            >
              Continue with Email
            </button>
          </div>
        </div>
      )}

      {/* ===== SIGNUP MODAL ===== */}
      {showSignup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-2xl shadow-xl p-8 w-96 relative'>
            <button
              onClick={() => setShowSignup(false)}
              className='absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg'
            >
              ✕
            </button>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Sign Up</h2>

            <input
              type='text'
              placeholder='Full Name'
              className='border rounded-lg w-full px-3 py-2 mb-3 focus:outline-green-500'
            />
            <input
              type='email'
              placeholder='Email'
              className='border rounded-lg w-full px-3 py-2 mb-3 focus:outline-green-500'
            />
            <input
              type='password'
              placeholder='Password'
              className='border rounded-lg w-full px-3 py-2 mb-4 focus:outline-green-500'
            />
            <button className='bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700'>
              Create Account
            </button>

            <p className='text-sm text-gray-600 mt-4'>
              Already have an account?{' '}
              <span
                className='text-blue-600 hover:underline cursor-pointer'
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
