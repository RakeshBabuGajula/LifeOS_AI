"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, TrendingUp, HeartPulse, BookOpen, AlertTriangle, CheckCircle, Brain, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InsightItem {
    type: "skill" | "career" | "wellness" | "alert" | "info";
    title: string;
    message: string;
    action: string;
    link: string;
}

interface InsightsData {
    today_insight: InsightItem | null;
    feed: InsightItem[];
}

export default function InsightsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<InsightsData | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchInsights = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/insights`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch insights", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [router]);

    const getIcon = (type: string) => {
        switch (type) {
            case "skill": return <Brain className="w-5 h-5 text-purple-500" />;
            case "career": return <Compass className="w-5 h-5 text-blue-500" />;
            case "wellness": return <HeartPulse className="w-5 h-5 text-pink-500" />;
            case "alert": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default: return <Sparkles className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "skill": return "bg-purple-500/10 border-purple-500/20";
            case "career": return "bg-blue-500/10 border-blue-500/20";
            case "wellness": return "bg-pink-500/10 border-pink-500/20";
            case "alert": return "bg-red-500/10 border-red-500/20";
            default: return "bg-yellow-500/10 border-yellow-500/20";
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-primary">Generatings Insights...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl mx-auto"
            >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Unified AI Insights</h1>
                <p className="text-muted-foreground text-lg">Your daily feed of career intelligence, skill gaps, and wellness checks.</p>
            </motion.div>

            {/* Hero Insight */}
            {data?.today_insight && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Zap className="w-64 h-64 text-primary" />
                        </div>
                        <CardContent className="p-8 md:p-12 md:flex items-center justify-between gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                    <Sparkles className="w-4 h-4" /> Today's Top Insight
                                </div>
                                <h2 className="text-3xl font-bold">{data.today_insight.title}</h2>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                    {data.today_insight.message}
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push(data.today_insight!.link)}
                                size="lg"
                                className="mt-6 md:mt-0 min-w-[200px] text-lg h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl"
                            >
                                {data.today_insight.action} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Feed */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" /> Recent Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.feed.slice(1).map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                        >
                            <Card className={`h-full border hover:shadow-md transition-all ${getBgColor(item.type)} bg-card`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className={`p-2 rounded-lg ${getBgColor(item.type).split(' ')[0]} bg-opacity-50`}>
                                            {getIcon(item.type)}
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4">{item.title}</CardTitle>
                                    <CardDescription className="text-base mt-2 min-h-[3rem]">
                                        {item.message}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between hover:bg-background/50 group"
                                        onClick={() => router.push(item.link)}
                                    >
                                        {item.action}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    {data?.feed.length === 1 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                            More insights will appear here as you use more modules.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
