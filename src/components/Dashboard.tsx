
import { User, MessageCircle } from "lucide-react";
import { useState } from "react";
import ActionPlanModal from "./ActionPlanModal";
import { useAuth } from "../auth/AuthContext";  // adjust path as needed

const MainDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id || ""; // fallback to empty string if user undefined

  const [showActionPlan, setShowActionPlan] = useState(false);

  if (!userId) {
    // Optionally handle or wait for auth userId
    return <div>Loading user info...</div>;
  }
    return (
        <div className="min-h-screen py-10">
      {showActionPlan && (
        <ActionPlanModal onClose={() => setShowActionPlan(false)} userId={userId} />
      )}
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                {/* Welcome Banner */}
                <div className="bg-white shadow-sm rounded-lg px-8 py-9 flex items-center space-x-4">
                    <div className="bg-[#34A853] p-3 rounded-full">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Welcome back, Mustafa! 👋
                        </h2>
                        <p className="text-sm text-gray-500">Ready to take your startup to the next level?</p>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Level 1 Founder</h2>
                    <div className="relative w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-[#1c6ed0]"
                            style={{ width: "40%" }}
                        ></div>
                    </div>
                    <span className="block text-sm text-gray-600 mt-2">100 / 250 XP</span>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">AI Recommendations for You</h2>

                            {/* Recommendation Card */}
                            <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                                <div className="flex justify-between">
                                    <h3 className="text-gray-900 font-medium">Focus on Product-Market Fit</h3>
                                    <span className="bg-[#EA4335] text-white text-xs font-medium px-3 py-1 rounded-full">
                                        Priority: high
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Based on your MVP stage, prioritize user feedback and iterate quickly to achieve product-market fit before scaling.
                                </p>
                                <div className="flex justify-between items-center">
                                    <button
                                        className="text-[#1c6ed0] text-sm font-medium hover:underline"
                                        onClick={() => setShowActionPlan(true)}
                                    >
                                        View Action Plan →
                                    </button>
                                    <span className="bg-[#34A853] text-white px-4 py-2 text-md rounded-full font-medium">
                                        Complete
                                    </span>
                                </div>
                            </div>

                            {/* Expert Help Card - Updated */}
                            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Need Expert Help?</h3>
                                    <p className="text-sm text-gray-500">Bizowl Services</p>
                                </div>

                                <p className="text-sm text-gray-600">
                                    This recommendation might benefit from professional guidance. Our experts at Bizowl can help you implement this effectively.
                                </p>

                                <div className="flex gap-4 pt-2">
                                    <button className="flex items-center gap-2 bg-[#34A853] text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition">
                                        <MessageCircle className="h-5 w-5" />
                                        WhatsApp
                                    </button>

                                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
                                        </svg>
                                        Schedule Call
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Expert Help (Big Card) */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
                            <h2 className="text-lg font-semibold text-gray-900">Need Expert Help?</h2>
                            <p className="text-gray-600 text-sm">
                                Based on your progress, you might benefit from professional consulting services. Our team at Bizowl specializes in helping startups like yours overcome challenges and accelerate growth.
                            </p>
                            <div className="flex gap-4 mt-3">
                                <button className="flex items-center gap-2 bg-[#1c6ed0] text-white px-12 py-2 rounded-md font-medium hover:bg-blue-700 transition">
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp
                                </button>
                                <button className="flex-1 border border-gray-300 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                                    Schedule Call
                                </button>
                            </div>
                        </div>

                        {/* Services / Action Plan */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">View Action Plan</h2>
                            <p className="text-sm text-gray-600">
                                Track your progress and implement recommendations effectively with expert guidance.
                            </p>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-[#1c6ed0] text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                    Schedule Free Consultation
                                </button>
                                <button className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                                    WhatsApp Us
                                </button>
                            </div>
                        </div>

                        {/* Your Journey Timeline */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Your Journey</h2>
                            <p className="text-sm text-gray-600">
                                Track your milestones as you grow your startup with our AI-driven insights.
                            </p>

                            <div className="relative pl-6">
                                <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                <div className="relative flex items-start mb-6">
                                    <div className="w-3 h-3 bg-[#1c6ed0] rounded-full absolute -left-1.5 top-1"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Completed Initial Assessment</p>
                                        <p className="text-xs text-gray-500">Jan 15, 2024</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start mb-6">
                                    <div className="w-3 h-3 bg-[#1c6ed0] rounded-full absolute -left-1.5 top-1"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Received First AI Recommendation</p>
                                        <p className="text-xs text-gray-500">Jan 16, 2024</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full absolute -left-1.5 top-1"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Scheduled Consultation with Bizowl</p>
                                        <p className="text-xs text-gray-500">Upcoming</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
