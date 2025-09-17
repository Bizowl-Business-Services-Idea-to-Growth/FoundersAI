import React, { useState } from "react";



type StepType =
  | {
      id: number;
      type: "options";
      question: string;
      options: { label: string; description?: string }[];
    }
  | {
      id: number;
      type: "checkbox";
      question: string;
      options: { label: string }[];
    }
  | { id: number; type: "textarea"; question: string; placeholder: string }
  | {
      id: number;
      type: "double-textarea";
      questions: { label: string; placeholder: string }[];
    };

const steps: StepType[] = [
  {
    id: 1,
    type: "options",
    question: "Who is your target customer segment?",
    options: [
      { label: "Individual consumers", description: "I am buying products or services for myself, my family, or personal use." },
      { label: "Small businesses", description: "I run a small company or startup, serving my local community or a specific niche." },
      { label: "Enterprises", description: "I work in a large organization that needs reliable, scalable solutions for complex operations." },
      { label: "Government/NGOs", description: "I am part of a government agency or nonprofit focused on public service and social impact." },
    ],
  },
  {
    id: 2,
    type: "checkbox",
    question: "What are your biggest challenges? (Select all that apply)",
    options: [
      { label: "Fundraising & Investment" },
      { label: "Technology & Development" },
      { label: "Team Building & Management" },
      { label: "Market Research & Validation" },
      { label: "Product Development" },
      { label: "Legal & Compliance" },
      { label: "Operations & Scaling" },
    ],
  },
  {
    id: 3,
    type: "options",
    question: "If targeting a crowded industry, do you focus on a niche?",
    options: [
      { label: "Yes, a large growing niche", description: "I am focusing on a specific, growing segment of the market with clear needs that are not fully met yet." },
      { label: "Yes, a small niche", description: "I am targeting a very specialized and narrow group of customers with unique preferences." },
      { label: "No, targeting the whole market", description: "My product or service is designed to appeal to a broad, general audience across the entire market." },
      { label: "Not applicable", description: "My startup is at a stage or in a sector where niche targeting does not apply." },
    ],
  },
  {
    id: 4,
    type: "textarea",
    question: "Briefly describe your Startup/idea.",
    placeholder: "Summarize your startup or idea in 2-3 sentences. What does it do and who is it for?",
  },
  {
    id: 5,
    type: "textarea",
    question: "What specific problem are you solving?",
    placeholder: "Describe the key pain point or issue your startup addresses.",
  },
  {
    id: 6,
    type: "textarea",
    question: "What is your proposed solution to this problem?",
    placeholder: "Explain how your product or service solves the problem.",
  },
  {
    id: 7,
    type: "textarea",
    question: "Who is your target audience or customer segment?",
    placeholder: "Identify the primary users or customers your startup aims to serve.",
  },
  {
    id: 8,
    type: "textarea",
    question: "What do you see as the biggest risks or challenges in building your startup? Any plans to overcome them?",
    placeholder: "Share top challenges and your approach to managing them.",
  },
  {
    id: 9,
    type: "textarea",
    question: "How large is this market, and what opportunity do you see in it?",
    placeholder: "Estimate the market size and growth potential you are targeting.",
  },
  {
    id: 10,
    type: "double-textarea",
    questions: [
      { label: "What are your key strengths?", placeholder: "Describe your strengths..." },
      { label: "What skill gaps do you need to address?", placeholder: "What skills do you need to develop or find help with..." },
    ],
  },
];

type Props = {
  onComplete: () => void;
  userId: string; 
};

const StartupAssessment: React.FC<Props> = ({ onComplete, userId }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [error, setError] = useState("");

  const currentStep = steps[step];

  // Validation function
  const validateStep = () => {
    const ans = answers[currentStep.id];

    if (currentStep.type === "options" && !ans) return false;
    if (currentStep.type === "checkbox" && (!ans || ans.length === 0)) return false;
    if (currentStep.type === "textarea" && (!ans || ans.trim() === "")) return false;
    if (currentStep.type === "double-textarea" && (!ans || ans.some((a: string) => a.trim() === ""))) return false;

    return true;
  };

  // Format answers for backend
  const formatAnswersForBackend = () => {
    return steps.map((step) => ({
      id: step.id,
      type: step.type,
      answer: answers[step.id] || (step.type === "checkbox" ? [] : ""),
    }));
  };

  // Handle next step or submit on last step
  const handleSubmit = async () => {
    if (!validateStep()) {
      setError("⚠️ Please fill this field before continuing");
      return;
    }
    setError("");

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Submit data to backend
      try {
        const payload = {
          userId,// Replace with real user ID from context/auth
          responses: formatAnswersForBackend(),
        };

        const response = await fetch("http://127.0.0.1:8000/save-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to save responses");
        }

        onComplete();
      } catch (error: any) {
        setError("Error saving responses: " + error.message);
      }
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-4xl mb-3 w-full p-10 bg-white rounded-2xl shadow-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-2xl text-gray-800">Startup Assessment</h2>
            <span className="text-gray-600 font-medium">
              Step {step + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#1c6ed0] h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep.type === "options" && (
            <>
              <h3 className="font-bold text-xl mb-5">{currentStep.question}</h3>
              <div className="space-y-4">
                {currentStep.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="block p-4 border rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <input
                      type="radio"
                      name={`step-${step}`}
                      className="mr-3"
                      checked={answers[currentStep.id] === opt.label}
                      onChange={() => setAnswers({ ...answers, [currentStep.id]: opt.label })}
                    />
                    <span className="font-medium">{opt.label}</span>
                    {opt.description && (
                      <p className="text-sm text-gray-500 mt-1 ml-7">{opt.description}</p>
                    )}
                  </label>
                ))}
              </div>
            </>
          )}

          {currentStep.type === "checkbox" && (
            <>
              <h3 className="font-bold text-xl mb-5">{currentStep.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-4 border rounded-xl shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={answers[currentStep.id]?.includes(opt.label) || false}
                      onChange={(e) => {
                        const prev = answers[currentStep.id] || [];
                        if (e.target.checked) {
                          setAnswers({ ...answers, [currentStep.id]: [...prev, opt.label] });
                        } else {
                          setAnswers({
                            ...answers,
                            [currentStep.id]: prev.filter((x: string) => x !== opt.label),
                          });
                        }
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {currentStep.type === "textarea" && (
            <>
              <h3 className="font-bold text-xl mb-5">{currentStep.question}</h3>
              <textarea
                className="w-full border rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder={currentStep.placeholder}
                value={answers[currentStep.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentStep.id]: e.target.value })}
              />
            </>
          )}

          {currentStep.type === "double-textarea" && (
            <div className="space-y-6">
              {currentStep.questions.map((q, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-xl mb-3">{q.label}</h3>
                  <textarea
                    className="w-full border rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder={q.placeholder}
                    value={answers[currentStep.id]?.[idx] || ""}
                    onChange={(e) => {
                      const prev = answers[currentStep.id] || ["", ""];
                      prev[idx] = e.target.value;
                      setAnswers({ ...answers, [currentStep.id]: [...prev] });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-100 font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-[#1c6ed0] text-white font-medium hover:bg-blue-700 transition"
          >
            {step === steps.length - 1 ? "Complete Assessment" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupAssessment;
