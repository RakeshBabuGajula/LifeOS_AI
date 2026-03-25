"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, FileText, CheckCircle, AlertTriangle, Calendar,
    Code, Brain, TrendingUp, Sparkles, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PDFExportButton } from "@/components/ui/pdf-button";

export default function ResumeAIPage() {
    const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Results
    const [inputType, setInputType] = useState<"upload" | "text">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [loadingMessage, setLoadingMessage] = useState("");
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [error, setError] = useState("");

    const resultRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        setError("");

        if (!targetRole.trim()) {
            setError("Please enter a target role.");
            return;
        }

        if (inputType === "upload" && !file) {
            setError("Please upload a resume (PDF).");
            return;
        }

        if (inputType === "text" && !resumeText.trim()) {
            setError("Please paste your resume text.");
            return;
        }

        setStep(2);
        setLoadingMessage("Analyzing Resume...");

        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = {
                "Authorization": `Bearer ${token}`
            };

            let extractedText = resumeText;

            // Step 1: Analyze Resume (if file uploaded)
            if (inputType === "upload" && file) {
                const formData = new FormData();
                formData.append("file", file);

                const analyzeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/analyze`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!analyzeRes.ok) throw new Error("Failed to analyze resume.");

                const analyzeData = await analyzeRes.json();
                extractedText = analyzeData.extracted_text;
            }

            if (!extractedText.trim()) {
                throw new Error("Could not extract text from the resume.");
            }

            // Step 2: Generate Roadmap
            setLoadingMessage("Consulting AI Career Coach via Gemini...");

            const roadmapRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/roadmap`, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resume_text: extractedText,
                    target_role: targetRole
                })
            });

            if (!roadmapRes.ok) throw new Error("AI Service unavailable. Please try again.");

            const data = await roadmapRes.json();
            setRoadmapData(data.roadmap_json);
            setStep(3);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
            setStep(1);
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
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4">
                    <Brain className="w-10 h-10 text-purple-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                    Resume Intelligence
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                    Upload your resume and get a CEO-level career roadmap powered by advanced AI.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
                            <CardHeader className="bg-purple-500/5 border-b border-border/50 p-8">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                    Configure Analysis
                                </CardTitle>
                                <CardDescription>Provide your details to generate a personalized strategy.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-medium">Target Role</label>
                                    <Input
                                        placeholder="e.g. Senior Machine Learning Engineer"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        className="h-12 text-lg"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium">Resume Source</label>
                                    <div className="flex gap-4">
                                        <Button
                                            variant={inputType === "upload" ? "default" : "outline"}
                                            onClick={() => setInputType("upload")}
                                            className="flex-1 h-12"
                                        >
                                            <Upload className="mr-2 w-4 h-4" /> Upload PDF
                                        </Button>
                                        <Button
                                            variant={inputType === "text" ? "default" : "outline"}
                                            onClick={() => setInputType("text")}
                                            className="flex-1 h-12"
                                        >
                                            <FileText className="mr-2 w-4 h-4" /> Paste Text
                                        </Button>
                                    </div>

                                    {inputType === "upload" ? (
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:bg-muted/50 transition-colors">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="resume-upload"
                                            />
                                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                                <div className="p-4 bg-background rounded-full shadow-sm">
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium">Click to upload resume</p>
                                                    <p className="text-xs text-muted-foreground">PDF files only (max 5MB)</p>
                                                </div>
                                                {file && <Badge variant="secondary" className="mt-2">{file.name}</Badge>}
                                            </label>
                                        </div>
                                    ) : (
                                        <Textarea
                                            placeholder="Paste your resume content here..."
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                            className="min-h-[200px] text-base p-4"
                                        />
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                                    onClick={handleGenerate}
                                >
                                    Generate AI Roadmap
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 space-y-8"
                    >
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                            <Brain className="absolute inset-0 m-auto w-10 h-10 text-purple-600 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">{loadingMessage}</h2>
                            <p className="text-muted-foreground">Analyzing career trajectory...</p>
                        </div>
                    </motion.div>
                )}

                {step === 3 && roadmapData && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Results Container */}
                        <div ref={resultRef} className="bg-background">

                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                                <Card className="md:col-span-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-indigo-500" />
                                            Career Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            {roadmapData.career_summary}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="md:col-span-4 flex flex-col justify-center items-center text-center p-6 border-green-500/20 bg-green-500/5">
                                    <div className="relative w-32 h-32 mb-4">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                                            <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-green-500"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - (roadmapData.job_readiness_score || 0) / 100)}`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-3xl font-bold">{roadmapData.job_readiness_score}%</span>
                                            <span className="text-xs text-muted-foreground">Readiness</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Market Ready Score</p>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Missing Skills */}
                                <Card className="border-red-500/20 bg-red-500/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                            <AlertTriangle className="w-5 h-5" />
                                            Critical Skill Gaps
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {roadmapData.missing_skills?.map((skill: string, i: number) => (
                                                <Badge key={i} variant="destructive" className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-white border-none">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Roadmap Overview */}
                                <Card className="border-blue-500/20 bg-blue-500/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                            <TrendingUp className="w-5 h-5" />
                                            Strategic Focus
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            To reach your goal of <span className="font-bold text-foreground">{targetRole}</span>, follow the {roadmapData.roadmap?.length || 6}-month plan below prioritizing hands-on projects.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Execution Roadmap</h2>
                                </div>
                                <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-8 pb-8">
                                    {roadmapData.roadmap?.map((phase: any, idx: number) => (
                                        <div key={idx} className="relative pl-8 md:pl-12">
                                            <span className="absolute -left-[11px] top-1 w-6 h-6 rounded-full bg-background border-4 border-primary" />
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg text-primary">{phase.month}</CardTitle>
                                                            <CardDescription className="font-medium text-foreground mt-1">{phase.focus}</CardDescription>
                                                        </div>
                                                        <Badge variant="outline">{idx + 1}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {phase.tasks?.map((task: string, tIdx: number) => (
                                                            <li key={tIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                                {task}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Projects */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Recommended Projects</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {roadmapData.project_ideas?.map((project: any, idx: number) => (
                                        <Card key={idx} className="flex flex-col h-full bg-secondary/5">
                                            <CardHeader>
                                                <CardTitle className="text-xl">{project.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-1 flex flex-col gap-4">
                                                <p className="text-muted-foreground text-sm flex-1">{project.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tech_stack?.map((tech: string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-4 pt-8">
                            <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                                Start New Analysis
                            </Button>
                            <div className="flex-1"></div>
                            <PDFExportButton contentRef={resultRef} filename={`Career_Roadmap_${targetRole?.replace(/\s+/g, '_')}`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
