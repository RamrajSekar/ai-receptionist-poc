import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        //Clear token and session
        localStorage.removeItem("token");
        
        // small delay then redirect to landing page
        const timer = setTimeout(() => navigate("/"), 1500);
        
        return () => clearTimeout(timer);
    }, [navigate]);

    return(
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Logging you out...
        </h2>
      <p className="text-gray-500">You will be redirected shortly.</p>
    </div>
    )
}