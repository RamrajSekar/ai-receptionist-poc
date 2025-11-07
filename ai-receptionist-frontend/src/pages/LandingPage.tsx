import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // ✅ Handle OAuth callback token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${API_BASE}/oauth/login/${provider}`;
  };

  const handleEmailLogin = async () => {
    try {
      setLoginError("");
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else throw new Error(data.detail || "Invalid credentials");
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleSignup = async () => {
    const firstname = (document.getElementById("firstname") as HTMLInputElement)?.value;
    const lastname = (document.getElementById("lastname") as HTMLInputElement)?.value;
    const email = (document.getElementById("signupEmail") as HTMLInputElement)?.value;
    const password = (document.getElementById("signupPassword") as HTMLInputElement)?.value;

    if (!firstname || !lastname || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`Signup failed: ${data.detail || "Unexpected error"}`);
        return;
      }

      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem("token", loginData.access_token);
        alert("Welcome aboard! Redirecting to your dashboard...");
        setShowSignup(false);
        navigate("/dashboard");
      } else {
        alert("Account created! Please login manually.");
        setShowSignup(false);
        setShowLogin(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed — check API connection.");
    }
  };

  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>AI Receptionist Portal | Automate Calls & Appointments</title>
        <meta
          name="description"
          content="AI Receptionist helps businesses automate call handling, booking, and follow-ups using voice AI. Save time, never miss a client, and stay connected effortlessly."
        />
        <meta
          name="keywords"
          content="AI receptionist, virtual assistant, voice agent, appointment scheduler, AI call automation"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ✅ Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-50 to-white px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Automate Your <span className="text-blue-600">Calls</span> &{" "}
          <span className="text-green-600">Bookings</span>
        </h1>
        <p className="text-gray-600 max-w-xl mb-8 text-lg">
          Let your AI Receptionist handle customer calls, confirm appointments, and
          send follow-ups — so you can focus on what matters most.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignup(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transition"
          >
            Sign Up
          </button>
        </div>

        {/* Trust Badges / SEO Booster */}
        <div className="flex flex-wrap justify-center items-center mt-10 gap-6 text-gray-500">
          <span>🚀 24/7 Availability</span>
          <span>•</span>
          <span>🔒 Secure Voice AI</span>
          <span>•</span>
          <span>💬 Smart Customer Engagement</span>
        </div>
      </div>

      {/* ===== LOGIN MODAL ===== */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-96 relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Login</h2>

            {/* OAuth Buttons */}
            <div className="flex justify-center gap-3 mb-5">
              <button
                onClick={() => handleOAuthLogin("google")}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google
              </button>
              <button
                onClick={() => handleOAuthLogin("microsoft")}
                className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft"
                  className="w-5 h-5 bg-white rounded-sm"
                />
                Microsoft
              </button>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border rounded-lg w-full px-3 py-2 mb-3 focus:outline-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-blue-500"
            />
            {loginError && <p className="text-red-600 text-sm mb-3">{loginError}</p>}
            <button
              onClick={handleEmailLogin}
              className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
            >
              Continue with Email
            </button>
          </div>
        </div>
      )}

      {/* ===== SIGNUP MODAL ===== */}
      {showSignup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-96 relative">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sign Up</h2>

            <input
              id="firstname"
              type="text"
              placeholder="First Name"
              className="border rounded-lg w-full px-3 py-2 mb-3 focus:outline-green-500"
            />
            <input
              id="lastname"
              type="text"
              placeholder="Last Name"
              className="border rounded-lg w-full px-3 py-2 mb-3 focus:outline-green-500"
            />
            <input
              id="signupEmail"
              type="email"
              placeholder="Email"
              className="border rounded-lg w-full px-3 py-2 mb-3 focus:outline-green-500"
            />
            <input
              id="signupPassword"
              type="password"
              placeholder="Password"
              className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-green-500"
            />
            <button
              onClick={handleSignup}
              className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
            >
              Create Account
            </button>

            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
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
    </>
  );
}
