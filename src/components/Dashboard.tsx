import { User, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import ActionPlanModal from "./ActionPlanModal";
import { useAuth } from "../auth/AuthContext";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MainDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const [showActionPlan, setShowActionPlan] = useState(false);

  const milestoneDates = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    return [
      { title: "Completed Initial Assessment", date: formatDate(yesterday) },
      { title: "Received First Strategic Insight", date: formatDate(today) },
      { title: "Scheduled Consultation with Bizowl", date: "Upcoming" },
    ];
  }, []);

  if (!userId) {
    return <div>Loading user info...</div>;
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      {showActionPlan && (
        <ActionPlanModal onClose={() => setShowActionPlan(false)} userId={userId} />
      )}
      <div className="max-w-7xl mx-auto px-6 space-y-10">
  <div className="bg-white shadow-sm rounded-lg px-8 py-9 flex items-center space-x-4">
    <div className="bg-[#34A853] p-3 rounded-full">
      <User className="w-6 h-6 text-white" />
    </div>
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Welcome back, {user?.name || "Founder"}! 👋
      </h2>
      <p className="text-sm text-gray-500">Empowering your growth—stay focused and take action!</p>
    </div>
  </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">AI Startup Growth Recommendations</h2>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 flex flex-col items-left space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">View Your Action Plan</h3>
                <p className="text-left text-gray-700 max-w-lg">
                  Explore your personalized action plan designed to help you achieve your startup goals with clarity and focus. Each step guides your journey forward with expert insights.
                </p>
                <button
                  onClick={() => setShowActionPlan(true)}
                  className="bg-[#1c6ed0] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Action Plan →
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Get Professional Guidance</h3>
                  <p className="text-sm text-gray-500">Bizowl Services</p>
                </div>
                <p className="text-sm text-gray-600">
                  Accelerate your journey with hands-on insights from experienced consultants. Share your challenge and our experts will support your next move.
                </p>
                <div className="flex gap-4 pt-2">
                  <a
                    href="https://wa.link/ocr4go"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#34A853] text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Team
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Journey</h2>
              <p className="text-sm text-gray-600">Track your milestones using our AI-driven insights.</p>
              <div className="relative pl-6">
                <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {milestoneDates.map((milestone, idx) => (
                  <div
                    key={milestone.title}
                    className={`relative flex items-start ${idx < milestoneDates.length - 1 ? "mb-6" : ""}`}
                  >
                    <div
                      className={`w-3 h-3 ${
                        idx < 2 ? "bg-[#1c6ed0]" : "bg-gray-300"
                      } rounded-full absolute -left-1.5 top-1`}
                    ></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-xs text-gray-500">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
