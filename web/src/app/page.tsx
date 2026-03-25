"use client";

import React from "react";
import Hero from "@/components/ui/animated-shader-hero";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Compass, TrendingUp, Activity, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStartJourney = () => {
    router.push("/signup");
  };

  const handleSeeHowItWorks = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero
        trustBadge={{
          text: "Trusted by forward-thinking teams.",
          icons: ["✨", "🚀", "⭐"]
        }}
        headline={{
          line1: "Upgrade Your",
          line2: "LifeOS AI"
        }}
        subtitle="AI-driven insights to navigate your career, bridge skill gaps, and prevent burnout before it happens."
        buttons={{
          primary: {
            text: "Start Your Journey",
            onClick: handleStartJourney
          },
          secondary: {
            text: "See How It Works",
            onClick: handleSeeHowItWorks
          }
        }}
      />

      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Power Up Your Career
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master your professional journey in one intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <Compass className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Career GPS</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Navigate your career path with AI-driven recommendations tailored to your goals and market trends.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 text-orange-600 dark:text-orange-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Skill Gap Predictor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Identify and bridge skill gaps before they affect your performance, keeping you ahead of the curve.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                  <Activity className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Burnout Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor work-life balance and receive early alerts to prevent burnout and maintain sustainable productivity.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Resume AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Craft the perfect resume with AI-powered analysis and optimization to help you stand out and land your dream job.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Invest in your career growth today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter Plan */}
            <Card className="bg-card rounded-3xl p-4 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-3xl font-bold">Free</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 mb-8">
                  {["Career GPS Basic", "Daily Mood Check-in", "Community Access"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full py-3 rounded-full text-center font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Get Started
                </button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-card rounded-3xl p-4 border border-primary ring-2 ring-primary/20 relative shadow-md flex flex-col hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
              <CardHeader>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold">$12/mo</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 mb-8">
                  {["Advanced Career Insights", "Full Skill Gap Analysis", "Burnout Prediction AI", "Priority Support"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full py-3 rounded-full text-center font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                >
                  Start Free Trial
                </button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-card rounded-3xl p-4 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold">Custom</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 mb-8">
                  {["Team Analytics", "Custom Integrations", "Dedicated Success Manager"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-full text-center font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Contact Sales
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
