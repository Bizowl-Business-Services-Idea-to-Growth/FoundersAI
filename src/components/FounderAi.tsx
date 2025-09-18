import React, { useState } from "react";
import { User, Bell, Brain } from "lucide-react";
import StartAssessment from "./StartAssessment";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const FounderAi: React.FC = () => {
  const [isDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.id) {
    return (
      <div className="p-4 text-center text-gray-600">Loading user information...</div>
    );
  }

  return (
    <div className={`min-h-screen antialiased transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
      {/* Navbar */}
      <nav className="w-full h-20 bg-white border-b border-[#1c6ed0] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-[#1c6ed0] p-2 rounded-lg">
            <Brain className="text-white" />
          </div>
          <div>
            <h1 className="text-[#1c6ed0] font-semibold text-2xl">FoundersAI</h1>
            <p className="text-gray-500 text-xs">by Bizowl</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-[#1c6ed0] cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profile" title={user?.email} className="w-8 h-8 flex items-center justify-center bg-[#1c6ed0] cursor-pointer text-white rounded-full font-semibold">
                {(user?.name?.[0] || "F").toUpperCase()}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-gray-600 hover:text-[#1c6ed0] cursor-pointer font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-600 hover:text-[#1c6ed0] font-medium">Sign in</Link>
              <Link to="/signup" className="px-3 py-1.5 bg-[#1c6ed0] text-white rounded-md text-sm font-medium">Sign up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1c6ed0] text-white flex items-center justify-center text-center px-4 py-20">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Empower Your Startup Journey</h1>
          <p className="text-lg md:text-xl font-medium mb-3">Analyze, Adapt, Succeed with FounderAI</p>
          <p className="text-sm md:text-base text-blue-100">
            Get personalized insights, actionable recommendations, and a clear roadmap to startup success
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`py-16 lg:py-24 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        {!showForm ? (
          <>
            <div className="bg-white h-40 mx-8 shadow-sm rounded-lg px-6 py-4 flex items-center space-x-4">
              <div className="bg-[#34A853] p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome back, {isAuthenticated ? user?.name : "Founder"}! <span className="inline-block">👋</span></h2>
                <p className="text-gray-500 text-sm">Ready to take your startup to the next level?</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg px-6 py-10 m-10 text-center">
              <div className="w-20 h-20 bg-[#1c6ed0] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Start Your <span className="text-[#1c6ed0]">Startup</span> Assessment
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Get personalized insights and recommendations based on your startup stage, challenges, and aspirations. Takes just 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#1c6ed0] text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Start Assessment
                </button>
                <button
                  className={`border-2 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 ${
                    isDarkMode ? "border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white" : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Watch Demo
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white shadow-md rounded-lg px-6 py-10 m-10">
            <StartAssessment onComplete={() => navigate("/dashboard")} userId={user.id} />
          </div>
        )}
      </section>
    </div>
  );
};

export default FounderAi;
