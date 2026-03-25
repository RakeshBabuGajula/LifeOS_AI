"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Brain, Lock, Compass, HeartPulse, Zap, Sparkles, BookOpen, Layout, X, TrendingUp, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Module {
    name: string;
    description: string;
    status: "active" | "locked";
}

interface WidgetData {
    career: { title: string; date: string; details: string; } | null;
    skill: { score: string; role: string; date: string; } | null;
    burnout: { score: number; level: string; date: string; } | null;
}

interface DashboardData {
    welcome_message: string;
    stats: Record<string, string>;
    modules: Module[];
    widgets: WidgetData;
}

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", desc: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login?session_expired=true");
                    return;
                }

                if (!res.ok) throw new Error("Failed to fetch dashboard data");

                const json = await res.json();
                setData(json);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="flex h-screen w-full items-center justify-center text-destructive">{error}</div>;

    const handleLaunch = (module: Module) => {
        if (module.status === "locked") {
            setModalContent({
                title: "Under Development",
                desc: `${module.name} is currently being built by our engineering team. You'll be notified when it launches!`
            });
            setShowModal(true);
        } else {
            if (module.name === "Career GPS") router.push("/dashboard/career-gps");
            if (module.name === "Skill Gap Predictor") router.push("/dashboard/skill-gap");
            if (module.name === "Burnout Monitor") router.push("/dashboard/burnout");
            if (module.name === "Resume Intelligence") router.push("/dashboard/resume-ai");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex justify-between items-end"
            >
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">{data?.welcome_message}</h1>
                    <p className="text-muted-foreground mt-2">Your personal AI operating system is ready.</p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/insights")}
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <Sparkles className="w-4 h-4" /> View Unified Insights
                </button>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {data?.modules?.map((module: Module, idx: number) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            {module.name === "Career GPS" && <Compass className="w-32 h-32 -mr-8 -mt-8 text-primary" />}
                            {module.name === "Skill Gap Predictor" && <Brain className="w-32 h-32 -mr-8 -mt-8 text-primary" />}
                            {module.name === "Burnout Monitor" && <HeartPulse className="w-32 h-32 -mr-8 -mt-8 text-primary" />}
                            {module.name === "Resume Intelligence" && <FileText className="w-32 h-32 -mr-8 -mt-8 text-primary" />}
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${module.status === "locked" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                                    {module.name === "Career GPS" && <Compass className="w-6 h-6" />}
                                    {module.name === "Skill Gap Predictor" && <Brain className="w-6 h-6" />}
                                    {module.name === "Burnout Monitor" && <HeartPulse className="w-6 h-6" />}
                                    {module.name === "Resume Intelligence" && <FileText className="w-6 h-6" />}
                                </div>
                                {module.status === "locked" ? <Lock className="w-5 h-5 text-muted-foreground" /> : <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                            </div>

                            <h3 className="text-xl font-bold mb-2">{module.name}</h3>
                            <p className="text-muted-foreground text-sm flex-1 mb-6">{module.description}</p>

                            <button
                                onClick={() => handleLaunch(module)}
                                className="w-full py-2.5 rounded-full border border-primary/20 bg-background text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                Launch Module {module.status === "locked" && <Lock className="w-3 h-3 ml-1" />}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Widget Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Career Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Compass className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">Latest Career Path</h3>
                    </div>
                    {data?.widgets?.career ? (
                        <div className="flex-1">
                            <div className="text-lg font-bold text-foreground mb-1 line-clamp-1">{data.widgets.career.title}</div>
                            <div className="text-xs text-muted-foreground mb-4">{new Date(data.widgets.career.date).toLocaleDateString()}</div>
                            <div className="p-3 bg-muted/50 rounded-xl text-sm mb-4">
                                <span className="font-semibold">{data.widgets.career.details}</span> found.
                            </div>
                            <button onClick={() => router.push("/dashboard/career-gps")} className="text-xs font-medium text-primary hover:underline">View Roadmap &rarr;</button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                            <p className="text-sm text-muted-foreground mb-3">No career paths generated yet.</p>
                            <button onClick={() => router.push("/dashboard/career-gps")} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Generate First</button>
                        </div>
                    )}
                </motion.div>

                {/* Skill Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Brain className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">Skill Readiness</h3>
                    </div>
                    {data?.widgets?.skill ? (
                        <div className="flex-1">
                            <div className="flex items-end gap-2 mb-1">
                                <div className="text-3xl font-bold text-foreground">{data.widgets.skill.score}</div>
                            </div>

                            <div className="text-sm text-muted-foreground mb-4">for {data.widgets.skill.role}</div>

                            <div className="w-full bg-muted/50 h-2 rounded-full mb-4 overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: data.widgets.skill.score }} />
                            </div>
                            <button onClick={() => router.push("/dashboard/skill-gap")} className="text-xs font-medium text-primary hover:underline">View Analysis &rarr;</button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                            <p className="text-sm text-muted-foreground mb-3">Analyze your skills to see readiness.</p>
                            <button onClick={() => router.push("/dashboard/skill-gap")} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Check Skills</button>
                        </div>
                    )}
                </motion.div>

                {/* Burnout Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <HeartPulse className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">Burnout Risk</h3>
                    </div>
                    {data?.widgets?.burnout ? (
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-3xl font-bold text-foreground">{data.widgets.burnout.score}<span className="text-sm text-muted-foreground ml-1">/100</span></div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${data.widgets.burnout.level === 'High' ? 'bg-red-500/10 text-red-500' : data.widgets.burnout.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {data.widgets.burnout.level}
                                </div>
                            </div>

                            {data.widgets.burnout.level === 'High' && <p className="text-xs text-red-500 mb-4 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Action Recommended</p>}
                            {data.widgets.burnout.level === 'Low' && <p className="text-xs text-green-500 mb-4 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Healthy Zone</p>}
                            {data.widgets.burnout.level === 'Medium' && <p className="text-xs text-yellow-500 mb-4 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Monitor Closely</p>}

                            <button onClick={() => router.push("/dashboard/burnout")} className="text-xs font-medium text-primary hover:underline">Track Wellness &rarr;</button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                            <p className="text-sm text-muted-foreground mb-3">No check-ins yet.</p>
                            <button onClick={() => router.push("/dashboard/burnout")} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Start Tracking</button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">{modalContent.title}</h2>
                            <p className="text-muted-foreground">
                                {modalContent.desc}
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors mt-4"
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
