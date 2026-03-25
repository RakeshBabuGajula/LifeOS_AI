"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap, Target, BookOpen, Clock,
    ChevronRight, X, TrendingUp, Briefcase, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { PDFExportButton } from "@/components/ui/pdf-button";

export default function CareerGPSPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Form, 2: Results
    const resultRef = useRef<HTMLDivElement>(null);

    // Form State
    const [currentSkill, setCurrentSkill] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [interest, setInterest] = useState("");
    const [level, setLevel] = useState("beginner");
    const [targetRole, setTargetRole] = useState("AI Engineer");

    // Results State
    const [roadmap, setRoadmap] = useState<any>(null);

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentSkill.trim()) {
            if (!skills.includes(currentSkill.trim())) {
                setSkills([...skills, currentSkill.trim()]);
            }
            setCurrentSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const generateRoadmap = async () => {
        if (skills.length === 0) {
            alert("Please add at least one skill.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/career/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills,
                    interest,
                    level,
                    target_role: targetRole
                })
            });

            if (!res.ok) throw new Error("Failed to generate roadmap");

            const data = await res.json();
            setRoadmap(data);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 max-w-7xl mx-auto space-y-12">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    Career GPS
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                    Your AI-powered career direction engine. Analyze your skills and generate a personalized roadmap to success.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/80">
                            <CardHeader className="bg-primary/5 border-b border-border/50 p-8">
                                <CardTitle className="text-2xl">Configure Your Path</CardTitle>
                                <CardDescription>Tell existing AI about your current state and goals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-8">
                                {/* Skills */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Current Skills <span className="text-muted-foreground ml-2">(Press Enter to add)</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skills.map(skill => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1 flex items-center gap-2 text-sm">
                                                {skill}
                                                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                                            </Badge>
                                        ))}
                                    </div>
                                    <Input
                                        placeholder="e.g. Python, React, SQL..."
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        className="h-12 text-lg"
                                    />
                                </div>

                                {/* Interest */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Core Interest</label>
                                    <Select
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        className="h-12 text-lg"
                                    >
                                        <option value="" disabled>Select an interest...</option>
                                        <option value="AI">Artificial Intelligence</option>
                                        <option value="Web">Web Development</option>
                                        <option value="Data">Data Science</option>
                                        <option value="Cloud">Cloud Computing</option>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Level */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Experience Level</label>
                                        <Select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="h-12"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </Select>
                                    </div>

                                    {/* Target Role */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Target Role</label>
                                        <Select
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            className="h-12"
                                        >
                                            <option value="AI Engineer">AI Engineer</option>
                                            <option value="Data Scientist">Data Scientist</option>
                                            <option value="MLOps Engineer">MLOps Engineer</option>
                                            <option value="Full Stack AI">Full Stack AI Developer</option>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold shadow-lg mt-4 group"
                                    variant="premium"
                                    onClick={generateRoadmap}
                                    isLoading={loading}
                                >
                                    {loading ? "Analyzing..." : "Generate Career Roadmap"}
                                    {!loading && <Zap className="ml-2 w-5 h-5 group-hover:text-yellow-300 transition-colors" />}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div ref={resultRef} className="space-y-8 p-4 bg-background">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Target Path</CardTitle>
                                        <Target className="h-4 w-4 text-indigo-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{roadmap?.career_path}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Based on your skills</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Estimated Timeline</CardTitle>
                                        <Clock className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{roadmap?.timeline_months} Months</div>
                                        <p className="text-xs text-muted-foreground mt-1">To reach job readiness</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
                                        <Layers className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {roadmap?.skill_gaps?.map((gap: string) => (
                                                <Badge key={gap} variant="destructive" className="text-xs rounded-sm">
                                                    {gap}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Timeline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                            Learning Path
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative border-l border-muted ml-3 space-y-8 py-2">
                                            {roadmap?.next_steps?.map((step: string, idx: number) => (
                                                <div key={idx} className="mb-8 ml-6 relative group">
                                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-background rounded-full -left-[42px] ring-4 ring-background border-2 border-primary text-xs font-bold text-primary">
                                                        {idx + 1}
                                                    </span>
                                                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{step}</h3>
                                                    <p className="text-sm text-muted-foreground">Focus area for month {idx + 1}-{idx + 2}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-primary" />
                                                Suggested Projects
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {roadmap?.suggested_projects?.map((proj: string, idx: number) => (
                                                <div key={idx} className="bg-muted/50 p-4 rounded-xl border border-border/50 hover:bg-muted transition-colors cursor-pointer">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <Badge variant="outline" className="text-xs font-normal">Project {idx + 1}</Badge>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <h4 className="font-semibold text-primary">{proj}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">Build this to demonstrate your new skills.</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                Reset and Start Over
                            </Button>
                            <PDFExportButton contentRef={resultRef} filename={`Career_Roadmap_${roadmap?.career_path}`} />
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
