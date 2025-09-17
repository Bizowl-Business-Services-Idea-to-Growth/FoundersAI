import React, { useState, useEffect } from "react";

interface ActionPlanGeneratorProps {
  userId: string;
}

const ActionPlanGenerator: React.FC<ActionPlanGeneratorProps> = ({ userId }) => {
  const [roadmap, setRoadmap] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log("[DEBUG] Fetching roadmap for userId:", userId);
    async function fetchRoadmap() {
      setLoading(true);
      setError("");
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/generate-roadmap/${userId}`);
        console.log("[DEBUG] Fetch response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("[DEBUG] Error response text:", errorText);
          throw new Error(`Failed to get roadmap: ${res.status}`);
        }
        const data = await res.json();
        console.log("[DEBUG] API response data:", data);
        setRoadmap(data.roadmap);
      } catch (err: any) {
        console.error("[DEBUG] Error caught during fetch:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchRoadmap();
    } else {
      console.warn("[DEBUG] userId is undefined or empty");
      setError("User ID is undefined. Cannot fetch roadmap.");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    console.log("[DEBUG] Loading state true, showing loader");
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-blue-100 text-[#1c6ed0] rounded-xl p-4 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle
              cx="12"
              cy="12"
              r="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Action Plan...</h2>
        <p className="text-gray-600 mb-6 text-center">
          Our AI is analyzing your recommendation and creating a personalized action plan.
        </p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#1c6ed0] rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-[#1c6ed0] rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-[#1c6ed0] rounded-full animate-bounce delay-300" />
        </div>
      </div>
    );
  }

  if (error) {
    console.log("[DEBUG] Error state true, showing error:", error);
    return (
      <div className="p-4 text-red-600 font-semibold text-center">
        Error loading roadmap: {error}
      </div>
    );
  }

  console.log("[DEBUG] Successfully loaded roadmap, rendering content");

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 text-[#1c6ed0] rounded-lg p-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H14l-2.5-2.5" />
              <path d="m14 21-2-2" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl text-gray-800">Overview</h3>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">{/* You can add static or dynamic overview here */}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span>Timeline: 4-8 weeks</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm whitespace-pre-wrap">
        <h3 className="font-semibold text-xl mb-4 text-gray-800">Personalized Roadmap</h3>
        {roadmap ? (
          <pre className="text-gray-700">{roadmap}</pre>
        ) : (
          <p className="text-gray-600">No roadmap available.</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-100 text-[#34A853] rounded-lg p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl text-gray-800">Success Metrics</h3>
        </div>

        <div className="space-y-3">
          {[
            "Clear implementation milestones achieved",
            "Measurable improvement in target metrics",
            "Positive feedback from stakeholders",
            "ROI meets or exceeds expectations",
          ].map((metric, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 text-[#34A853] rounded-full flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <span className="text-gray-700">{metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionPlanGenerator;
