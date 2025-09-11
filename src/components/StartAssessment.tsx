import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import Dashboard from './Dashboard';

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
        question: "What stage is your startup currently in?",
        options: [
            { label: "Idea Stage", description: "I have a business idea but haven't built anything yet" },
            { label: "MVP Stage", description: "I have a minimum viable product and early users" },
            { label: "Growth Stage", description: "I have product-market fit and am scaling" },
            { label: "Scale Stage", description: "I'm expanding operations and preparing for exit" },
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
        type: "textarea",
        question: "What are your main aspirations and goals?",
        placeholder: "Tell us about your vision, goals, and what success looks like for your startup...",
    },
    {
        id: 4,
        type: "double-textarea",
        questions: [
            { label: "What are your key strengths?", placeholder: "Describe your strengths..." },
            { label: "What skill gaps do you need to address?", placeholder: "What skills do you need to develop or find help with..." },
        ],
    },
];

const StartupAssessment: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [error, setError] = useState("");

    const currentStep = steps[step];

    // ✅ Validation function
    const validateStep = () => {
        const ans = answers[currentStep.id];

        if (currentStep.type === "options" && !ans) return false;
        if (currentStep.type === "checkbox" && (!ans || ans.length === 0)) return false;
        if (currentStep.type === "textarea" && (!ans || ans.trim() === "")) return false;
        if (currentStep.type === "double-textarea" && (!ans || ans.some((a: string) => a.trim() === ""))) return false;

        return true;
    };

    const nextStep = () => {
        if (!validateStep()) {
            setError("⚠️ Please fill this field before continuing");
            return;
        }
        setError("");
        if (step < steps.length - 1) setStep(step + 1);
        else onComplete();
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
                                    <label key={idx} className="block p-4 border rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all">
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
                                    <label key={idx} className="flex items-center gap-3 p-4 border rounded-xl shadow-sm hover:shadow-md cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={answers[currentStep.id]?.includes(opt.label) || false}
                                            onChange={(e) => {
                                                const prev = answers[currentStep.id] || [];
                                                if (e.target.checked) {
                                                    setAnswers({ ...answers, [currentStep.id]: [...prev, opt.label] });
                                                } else {
                                                    setAnswers({ ...answers, [currentStep.id]: prev.filter((x: string) => x !== opt.label) });
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
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg bg-[#1c6ed0] text-white font-medium hover:bg-blue-700 transition"
                    >
                        {step === steps.length - 1 ? "Complete Assessment" : "Next Step"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [currentView, setCurrentView] = useState<'assessment' | 'loading' | 'dashboard'>('assessment');

    const handleAssessmentComplete = () => {
        setCurrentView('loading');
        setTimeout(() => setCurrentView('dashboard'), 3000);
    };

    return (
        <>
            {currentView === 'assessment' && <StartupAssessment onComplete={handleAssessmentComplete} />}
            {currentView === 'loading' && <LoadingScreen />}
            {currentView === 'dashboard' && <Dashboard />}
        </>
    );
};

export default App;
