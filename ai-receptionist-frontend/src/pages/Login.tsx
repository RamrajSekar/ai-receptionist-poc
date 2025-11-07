import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Login failed:", data);
        alert(`Login failed Check EmailId/Password : ${data.detail || res.statusText}`);
        return;
      }
      else { alert("Login Success!!") }
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed Check EmailId/Password!!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full px-3 py-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full px-3 py-2 mb-6"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Click here to sign up!
          </Link>
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{" "}
            <button
              onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/login/google`}
              className="w-full bg-blue border text-gray-700 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-10 h-5 mr-2"
              />
              
            </button>

            <button
              onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/login/microsoft`}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Google"
                className="w-10 h-5 mr-2"
              />
              
            </button>
          </p>
        </div>
      </div>
      
    </div>
  );
}
