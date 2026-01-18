import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const error = useAuthStore((state) => state.error);
    const sessionExpired = useAuthStore((state) => state.sessionExpired);
    const clearError = useAuthStore((state) => state.clearError);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        const handleInput = () => {
            if (error || sessionExpired) {
                clearError();
            }
        };

        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');

        if (emailInput && passwordInput) {
            emailInput.addEventListener('input', handleInput);
            passwordInput.addEventListener('input', handleInput);

            return () => {
                emailInput.removeEventListener('input', handleInput);
                passwordInput.removeEventListener('input', handleInput);
            };
        }
    }, [error, sessionExpired, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearError();

        const result = login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setIsLoading(false);
        }
    };

    const displayError = sessionExpired
        ? "Session expired. Please login again."
        : error;

    return (
        <div className="min-h-screen w-full flex">
            {/* Background */}
            <div className="fixed inset-0 bg-teal-400 opacity-90" style={{
                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 50%, #8b5cf6 100%)'
            }}></div>

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col lg:flex-row">
                {/* Left side */}
                <div className="w-full lg:w-1/2 text-white p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-lg mx-auto lg:mx-0">
                        <div className="flex items-center mb-6 sm:mb-8">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                                <div className="w-6 h-6 bg-teal-500 rounded transform rotate-45"></div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                PM Admin
                            </h1>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                            Command Center for Your Projects.
                        </h2>

                        <p className="text-lg sm:text-xl text-white opacity-90 mb-3 sm:mb-4">
                            Join The Waitlist For The Admin Dashboard!
                        </p>

                        <p className="text-sm sm:text-base text-white opacity-80 leading-relaxed">
                            Gain complete oversight and control. This powerful admin dashboard centralizes project data, team performance, and analytics, giving you the authority to steer every initiative to success.
                        </p>
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                {sessionExpired ? "Session Expired" : "Welcome Back"}
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm">
                                {sessionExpired
                                    ? "Your session has expired. Please login again."
                                    : "Sign in to access your project dashboard."
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-11 sm:h-12 bg-gray-50 border-0 rounded-lg px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-11 sm:h-12 bg-gray-50 border-0 rounded-lg px-4 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {displayError && (
                                <div className={`rounded-lg p-3 animate-fadeIn ${sessionExpired
                                    ? 'bg-amber-50 border border-amber-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <div className={`text-sm text-center ${sessionExpired ? 'text-amber-700' : 'text-red-700'
                                        }`}>
                                        {displayError}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 sm:h-12 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
                                style={{ boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </button>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-small">Email:</span> admin@gmail.com
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-small">Password:</span> 123456
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}