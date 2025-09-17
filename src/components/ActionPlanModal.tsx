import React, { useState } from "react";
import ActionPlanGenerator from "./ActionPlanGenrater";
import { useAuth } from "../auth/AuthContext";

interface ActionPlanModalProps {
  onClose: () => void;
  userId: string;
}

const ActionPlanModal: React.FC<ActionPlanModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [showGenerator, setShowGenerator] = useState(false);

  if (!userId) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-5xl h-[85vh] overflow-hidden z-10 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-semibold z-20"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="overflow-y-auto p-8 w-full h-full rounded-2xl bg-white shadow-md flex flex-col">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900">0 to 1 Action Plan for Your Startup</h1>

           <p className="text-base text-gray-700 bg-gray-100 px-4 py-2 mt-4 rounded-md">
  Take your startup from concept to traction with a clear, focused action plan. This plan helps you prioritize key growth milestones and execute efficiently.
</p>
          </div>

          {!showGenerator ? (
            <div className="text-center mt-20">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 text-[#1c6ed0] rounded-full p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-2">Generate Detailed Action Plan</h2>

              <p className="text-base text-gray-600 mb-8">
                Get a step-by-step action plan with timelines, resources, and success metrics powered by AI.
              </p>

              <button
                onClick={() => setShowGenerator(true)}
                className="w-full bg-[#1c6ed0] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Generate Action Plan
              </button>
            </div>
          ) : (
            <ActionPlanGenerator userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionPlanModal;
