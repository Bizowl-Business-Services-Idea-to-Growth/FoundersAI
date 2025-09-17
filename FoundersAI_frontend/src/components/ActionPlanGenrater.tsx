import React, { useState } from "react";

const ActionPlanGenerator = () => {
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-blue-100 text-[#1c6ed0] rounded-xl p-4 mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="3" />
                        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Creating Your Action Plan...
                </h2>
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

    return (
        <div className="space-y-6 p-4">
            {/* Overview Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 text-[#1c6ed0] rounded-lg p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H14l-2.5-2.5" />
                            <path d="m14 21-2-2" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-800">Overview</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                    This high priority recommendation is crucial for your MVP stage business. Based on your MVP stage, prioritize user feedback and iterate quickly to achieve product-market fit before scaling. Implementing this will help address your current challenges and move you closer to your goals.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>Timeline: 4-8 weeks</span>
                </div>
            </div>

            {/* Success Metrics Card */}
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
                        "ROI meets or exceeds expectations"
                    ].map((metric, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-100 text-[#34A853] rounded-full flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            </div>
                            <span className="text-gray-700">{metric}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Steps Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 text-[#1c6ed0] rounded-lg p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-800">Action Steps</h3>
                </div>

                <div className="space-y-6">
                    {/* Step 1 Card */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-[#1c6ed0] text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                1
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold text-gray-900">Research and Planning</h4>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span className="bg-[rgb(243,249,255)] text-[rgb(48,130,22)] px-2 py-1 rounded text-xs font-medium">Medium</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                        <span className="text-gray-500">1-2 weeks</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Conduct thorough research and create a detailed plan for implementing this recommendation.
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Resources needed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Industry reports", "Competitor analysis", "Planning tools"].map((resource, idx) => (
                                            <span key={idx} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
                                                {resource}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 Card */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-[#1c6ed0] text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                2
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold text-gray-900">Implementation Setup</h4>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span className="bg-[rgb(243,249,255)] text-[rgb(48,130,22)] px-2 py-1 rounded text-xs font-medium">Medium</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                        <span className="text-gray-500">1 week</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Prepare technical tools, align your team, and allocate budget.
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Resources needed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Technical tools", "Team alignment", "Budget allocation"].map((resource, idx) => (
                                            <span key={idx} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
                                                {resource}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 Card */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-[#1c6ed0] text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                3
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold text-gray-900">Execute and Monitor</h4>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span className="bg-red-100 text-[#EA4335] px-2 py-1 rounded text-xs font-medium">Hard</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                        <span className="text-gray-500">2-4 weeks</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Begin implementation while closely monitoring progress and making adjustments as needed.
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Resources needed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Tracking systems", "Regular reviews", "Feedback loops"].map((resource, idx) => (
                                            <span key={idx} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
                                                {resource}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Tips Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-100 text-yellow-600 rounded-lg p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-800">Pro Tips</h3>
                </div>

                <div className="space-y-3">
                    {[
                        "Start with small, measurable steps to build momentum",
                        "Regular check-ins and adjustments are key to success",
                        "Document your progress to track what works best",
                        "Don't hesitate to seek expert advice when needed"
                    ].map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <span className="text-gray-700 leading-relaxed">{tip}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Resources Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 text-[rgb(124,132,201)] rounded-lg p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10,9 9,9 8,9" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-800">Additional Resources</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">📚 Learning Materials</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Product-Market Fit Guide</li>
                            <li>• MVP Development Handbook</li>
                            <li>• Customer Feedback Templates</li>
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">🛠️ Tools & Templates</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Progress Tracking Spreadsheet</li>
                            <li>• User Interview Questions</li>
                            <li>• Metrics Dashboard Template</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 text-[#1c6ed0] rounded-lg p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-800">Ready to Start?</h3>
                </div>

                <p className="text-gray-700 mb-4">
                    Your action plan is ready! Start with Step 1 and track your progress as you work towards achieving product-market fit.
                </p>

                <div className="flex space-x-3">
                    <button className="bg-[#1c6ed0] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Start Implementation
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        Download Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionPlanGenerator;