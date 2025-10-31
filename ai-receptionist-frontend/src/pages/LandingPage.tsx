import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        AI Receptionist Portal
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Automate your appointment scheduling and stay connected effortlessly.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
