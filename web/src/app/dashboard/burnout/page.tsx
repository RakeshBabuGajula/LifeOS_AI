"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    HeartPulse,
    Zap,
    Moon,
    Sun,
    Activity,
    AlertTriangle,
    CheckCircle,
    Calendar,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PDFExportButton } from "@/components/ui/pdf-button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface BurnoutLog {
    id: string;
    created_at: string;
    mood: number;
    stress: number;
    work_hours: number;
    sleep_quality: "Poor" | "Average" | "Good";
    notes?: string;
    burnout_risk_score: number;
    risk_level: "Low" | "Medium" | "High";
    insights: string[];
    recommended_actions: string[];
}

export default function BurnoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<BurnoutLog[]>([]);
    const [todayLog, setTodayLog] = useState<BurnoutLog | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Form State
    const [mood, setMood] = useState(3);
    const [stress, setStress] = useState(5);
    const [workHours, setWorkHours] = useState(8);
    const [sleepQuality, setSleepQuality] = useState("Average");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchHistory(token);
    }, [router]);

    const fetchHistory = async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/burnout/history?limit=7`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data: BurnoutLog[] = await res.json();
                setHistory(data);

                // Check if checked in today
                if (data.length > 0) {
                    const lastLog = data[0];
                    const logDate = new Date(lastLog.created_at).toDateString();
                    const today = new Date().toDateString();
                    if (logDate === today) {
                        setTodayLog(lastLog);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/burnout/checkin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    mood,
                    stress,
                    work_hours: workHours,
                    sleep_quality: sleepQuality,
                    notes
                })
            });

            if (res.ok) {
                const newLog = await res.json();
                setTodayLog(newLog);
                setHistory([newLog, ...history]);
            }
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case "Low": return "text-green-500";
            case "Medium": return "text-yellow-500";
            case "High": return "text-red-500";
            default: return "text-gray-500";
        }
    };

    const getRiskBg = (level: string) => {
        switch (level) {
            case "Low": return "bg-green-500/10 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 border-yellow-500/20";
            case "High": return "bg-red-500/10 border-red-500/20";
            default: return "bg-gray-500/10";
        }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center text-primary">Loading...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <HeartPulse className="w-8 h-8 text-primary" />
                        Burnout Monitor
                    </h1>
                    <p className="text-muted-foreground mt-1">Track stress, prevent burnout, optimize your work-life balance.</p>
                </div>
                {todayLog && <PDFExportButton contentRef={contentRef} filename="Burnout_Report" />}
            </motion.div>

            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 bg-background">
                {/* Left Column: Check-in / Today's Status */}
                <AnimatePresence mode="wait">
                    {!todayLog ? (
                        <motion.div
                            key="checkin-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-primary/20 bg-gradient-to-br from-card to-background shadow-lg">
                                <CardHeader>
                                    <CardTitle>Daily Check-In</CardTitle>
                                    <CardDescription>How work feels for you today?</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Mood */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium">Mood</label>
                                            <span className="text-sm text-primary font-bold">{mood}/5</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground px-1 mb-2">
                                            <span>Drained</span>
                                            <span>Energized</span>
                                        </div>
                                        <Slider
                                            value={[mood]}
                                            min={1}
                                            max={5}
                                            step={1}
                                            onValueChange={(val) => setMood(val[0])}
                                        />
                                    </div>

                                    {/* Stress */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium">Stress Level</label>
                                            <span className="text-sm text-destructive font-bold">{stress}/10</span>
                                        </div>
                                        <Slider
                                            value={[stress]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(val) => setStress(val[0])}
                                            className="[&>span:first-child]:bg-destructive/20 [&>span:first-child_span]:bg-destructive"
                                        />
                                    </div>

                                    {/* Work Hours & Sleep */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Work Hours</label>
                                            <input
                                                type="number"
                                                value={workHours}
                                                onChange={(e) => setWorkHours(Number(e.target.value))}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Sleep Quality</label>
                                            <Select value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value)}>
                                                <option value="Poor">Poor</option>
                                                <option value="Average">Average</option>
                                                <option value="Good">Good</option>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Notes (Optional)</label>
                                        <Textarea
                                            placeholder="What's on your mind?"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                                    >
                                        {submitting ? "Analyzing..." : "Submit Check-In"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <Card className={`border-2 ${getRiskBg(todayLog.risk_level)} shadow-xl`}>
                                <CardContent className="p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Activity className="w-32 h-32" />
                                    </div>

                                    <h3 className="text-lg font-medium text-muted-foreground mb-4">Daily Burnout Risk</h3>

                                    <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                                        {/* Simple SVG Ring */}
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * todayLog.burnout_risk_score) / 100}
                                                className={`${getRiskColor(todayLog.risk_level)} transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-bold ${getRiskColor(todayLog.risk_level)}`}>{todayLog.burnout_risk_score}</span>
                                            <span className="text-sm text-muted-foreground">/100</span>
                                        </div>
                                    </div>

                                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${getRiskBg(todayLog.risk_level)}`}>
                                        <span className={getRiskColor(todayLog.risk_level)}>{todayLog.risk_level} Risk</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-purple-500" /> AI Insights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {todayLog.insights.map((insight, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Recommended Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {todayLog.recommended_actions.map((action, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2 text-foreground font-medium">
                                                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Column: Trends & History */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Productivity & Health Trends</CardTitle>
                            <CardDescription>Your last 7 days performance</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {history.length > 1 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[...history].reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis
                                            dataKey="created_at"
                                            tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })}
                                            tick={{ fontSize: 12, fill: '#888' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis hide domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="burnout_risk_score"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={{ r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                            name="Burnout Risk"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="stress"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ r: 4, strokeWidth: 0 }}
                                            name="Stress"
                                        // Scale stress to 0-100 for viz or keep separate axis? Keeping simple for now
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                    Not enough data for trends
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {history.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 rounded-full ${getRiskColor(log.risk_level).replace('text-', 'bg-')}`} />
                                            <div>
                                                <div className="font-medium">{new Date(log.created_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-muted-foreground">Mood: {log.mood}/5 • Sleep: {log.sleep_quality}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold ${getRiskColor(log.risk_level)}`}>{log.burnout_risk_score}</div>
                                            <div className="text-xs text-muted-foreground">Risk Score</div>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">No history yet</div>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


