"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    CheckCircle2,
    BookOpen,
    Code,
    AlertCircle,
    Loader2,
    Calendar,
    Target
} from "lucide-react";
import { PDFExportButton } from "@/components/ui/pdf-button";
import { useRef } from "react";

interface SkillGapReport {
    job_readiness_score: number;
    missing_skills: string[];
    priority_learning_steps: string[];
    recommended_projects: string[];
    estimated_time_months: number;
}

interface HistoryItem {
    target_role: string;
    level: string;
    report: SkillGapReport;
    created_at: string;
}

const ROLES = [
    "AI/ML Engineer",
    "Data Scientist",
    "MLOps Engineer",
    "Full Stack Developer",
    "Product AI Engineer"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function SkillGapPage() {
    const router = useRouter();
    const [skills, setSkills] = useState("");
    const [role, setRole] = useState(ROLES[0]);
    const [level, setLevel] = useState(LEVELS[1]);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<SkillGapReport | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill-gap/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Parse skills from comma separated string
        const skillsList = skills.split(",").map(s => s.trim()).filter(s => s.length > 0);

        if (skillsList.length === 0) {
            setError("Please enter at least one skill.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill-gap/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: skillsList,
                    target_role: role,
                    level: level
                })
            });

            if (!res.ok) throw new Error("Analysis failed");

            const data = await res.json();
            setReport(data);
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error(err);
            setError("Failed to generate analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Brain className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Skill Gap Predictor</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Identify what’s missing between you and your dream role.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                        <form onSubmit={handleAnalyze} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Experience Level</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Skills (comma separated)</label>
                                <textarea
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="Python, React, SQL..."
                                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Brain className="w-4 h-4" /> Analyze My Skill Gap</>}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        {report ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Target className="w-32 h-32" />
                                    </div>

                                    <h2 className="text-xl font-bold mb-6">Analysis Results</h2>

                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                    className={`${report.job_readiness_score > 70 ? "text-green-500" : report.job_readiness_score > 40 ? "text-yellow-500" : "text-destructive"}`}
                                                    strokeDasharray={377}
                                                    strokeDashoffset={377 - (377 * report.job_readiness_score) / 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-bold">{report.job_readiness_score}%</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ready</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">Estimated Timeline</div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    {report.estimated_time_months} Months to reach goal
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-2">Missing Critical Skills</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {report.missing_skills.map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Roadmap steps */}
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" /> Priority Learning Steps
                                    </h3>
                                    <div className="space-y-4">
                                        {report.priority_learning_steps.map((step, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects */}
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Code className="w-5 h-5 text-primary" /> Recommended Projects
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {report.recommended_projects.map((proj, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                                                <div className="text-sm font-semibold text-primary mb-1">Project Idea #{i + 1}</div>
                                                <p className="text-sm text-muted-foreground">{proj}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                                <div className="p-4 rounded-full bg-muted mb-4">
                                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-muted-foreground">No analysis generated yet</h3>
                                <p className="text-sm text-muted-foreground/80 mt-1 max-w-xs">
                                    Fill out the form on the left to generate your personalized skill gap analysis.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* History Section */}
            {history.length > 0 && (
                <div className="mt-20 border-t border-border pt-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Previous Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setReport(item.report)}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-sm font-medium">{item.target_role}</div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.report.job_readiness_score > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.report.job_readiness_score}% Ready
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-3">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${item.report.job_readiness_score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
