import React, { useState, useEffect, useMemo } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

interface ActionPlanGeneratorProps { userId: string; assessmentId?: string }

interface RoadmapStep {
  sequence: number;
  title: string;
  description: string;
  duration?: string;
  kpis?: string;
  dependencies?: string;
  bizowl_support?: string;
}

interface StructuredRoadmap {
  overview?: string;
  problem_identification?: string;
  possible_solutions?: { title: string; rationale: string; risks: string; bizowl_services: string }[];
  best_recommended_solution?: { title: string; why_best: string; implementation_focus: string; key_risks: string; mitigation: string };
  roadmap?: RoadmapStep[];
  conclusion?: string;
  // Allow any extra keys gracefully
  [key: string]: any;
}

const ActionPlanGenerator: React.FC<ActionPlanGeneratorProps> = ({ userId, assessmentId }) => {
  const [rawResponse, setRawResponse] = useState<string>("");
  const [structured, setStructured] = useState<StructuredRoadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      setError("");
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const endpoint = assessmentId ? `${baseUrl}/generate-roadmap/${userId}/${assessmentId}` : `${baseUrl}/generate-roadmap/${userId}`;
  const res = await fetch(endpoint);
        if (!res.ok) {
            throw new Error(`Failed to get roadmap: ${res.status}`);
        }
        const data = await res.json();
        const text: string = data.roadmap || "";
        setRawResponse(text);

        // Attempt to parse structured JSON
        let parsed: any = null;
        try {
          // Trim potential stray whitespace
          const trimmed = text.trim();
          // Some models might wrap JSON in backticks or code fences; strip them
          const cleaned = trimmed.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
          parsed = JSON.parse(cleaned);
        } catch (parseErr) {
          console.warn("[ActionPlan] Failed to parse structured JSON, will fallback.", parseErr);
        }
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setStructured(parsed as StructuredRoadmap);
        } else if (Array.isArray(parsed)) {
          // Legacy format: plain array of steps -> map into structured form
            const legacyRoadmap: RoadmapStep[] = parsed.map((s: any, idx: number) => ({
              sequence: idx + 1,
              title: s.title || `Step ${idx + 1}`,
              description: s.description || JSON.stringify(s),
              duration: s.duration || "",
              kpis: s.kpis || "",
              dependencies: s.dependencies || "",
              bizowl_support: s.bizowl_support || ""
            }));
            setStructured({ roadmap: legacyRoadmap });
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error fetching roadmap.");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchRoadmap(); else { setError("User ID is undefined. Cannot fetch roadmap."); setLoading(false);}    
  }, [userId, assessmentId]);

  const sortedSteps: RoadmapStep[] = useMemo(() => {
    if (!structured?.roadmap) return [];
    return [...structured.roadmap].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  }, [structured]);

  if (loading) {
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
    return (
      <div className="p-4 text-red-600 font-semibold text-center">
        Error loading roadmap: {error}
      </div>
    );
  }
  const hasStructured = !!structured;

  return (
    <div className="space-y-8 p-4 max-w-5xl mx-auto">
      {/* Overview */}
      {hasStructured && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{structured?.overview || "No overview generated."}</p>
        </section>
      )}

      {/* Problem Identification */}
      {structured?.problem_identification && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Problem Identification</h2>
          <p className="text-gray-700 whitespace-pre-line">{structured.problem_identification}</p>
        </section>
      )}

      {/* Possible Solutions */}
      {structured?.possible_solutions && structured.possible_solutions.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Possible Solutions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {structured.possible_solutions.map((s, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 flex flex-col bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Rationale:</span> {s.rationale}</p>
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Risks:</span> {s.risks}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Bizowl Services:</span> {s.bizowl_services}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Recommended Solution */}
      {structured?.best_recommended_solution && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Best Recommended Solution</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{structured.best_recommended_solution.title}</h3>
            <p className="text-gray-700"><span className="font-medium">Why Best:</span> {structured.best_recommended_solution.why_best}</p>
            <p className="text-gray-700"><span className="font-medium">Implementation Focus:</span> {structured.best_recommended_solution.implementation_focus}</p>
            <p className="text-gray-700"><span className="font-medium">Key Risks:</span> {structured.best_recommended_solution.key_risks}</p>
            <p className="text-gray-700"><span className="font-medium">Mitigation:</span> {structured.best_recommended_solution.mitigation}</p>
          </div>
        </section>
      )}

      {/* Roadmap Timeline */}
      {sortedSteps.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Roadmap & Timeline (0→1)</h2>
          <VerticalTimeline lineColor="#1c6ed0">
            {sortedSteps.map(step => (
              <VerticalTimelineElement
                key={step.sequence}
                date={step.duration || ""}
                icon={<div className="text-white text-sm font-bold">{step.sequence}</div>}
                iconStyle={{ background: '#1c6ed0', color: '#fff' }}
                contentStyle={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line mb-3">{step.description}</p>
                <div className="flex flex-col gap-1 text-xs text-gray-600">
                  {step.kpis && <div><span className="font-medium">KPIs:</span> {step.kpis}</div>}
                  {step.dependencies && <div><span className="font-medium">Dependencies:</span> {step.dependencies}</div>}
                  {step.bizowl_support && <div><span className="font-medium">Bizowl Support:</span> {step.bizowl_support}</div>}
                </div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </section>
      )}

      {/* Fallback raw roadmap if no structured parse */}
      {!hasStructured && rawResponse && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm whitespace-pre-wrap">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Roadmap (Raw)</h2>
          <pre className="text-gray-700 text-sm">{rawResponse}</pre>
        </section>
      )}

      {/* Conclusion */}
      {structured?.conclusion && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Conclusion</h2>
          <p className="text-gray-700 whitespace-pre-line">{structured.conclusion}</p>
        </section>
      )}

      {/* Success Metrics (generic helper) */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Success Metrics (General)</h2>
        <div className="space-y-3">
          {["Clear implementation milestones achieved","Measurable improvement in target metrics","Positive feedback from stakeholders","ROI meets or exceeds expectations"].map((metric, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 text-[#34A853] rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm">{metric}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ActionPlanGenerator;
