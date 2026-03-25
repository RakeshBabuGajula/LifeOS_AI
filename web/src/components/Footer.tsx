"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup") return null;

    return (
        <footer className="bg-background border-t border-border mt-32 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">LifeOS AI</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        AI-powered career, skill, and wellness management for the modern professional.
                    </p>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Features</li>
                        <li>Pricing</li>
                        <li>Roadmap</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>About</li>
                        <li>Blog</li>
                        <li>Careers</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                © 2026 LifeOS AI. All rights reserved.
            </div>
        </footer>
    );
}
