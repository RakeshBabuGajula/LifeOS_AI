"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);

        // Check login status
        const token = localStorage.getItem("token");
        // Use timeout to avoid synchronous setState warning
        setTimeout(() => setIsLoggedIn(!!token), 0);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowDropdown(false);
        router.push("/login");
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    LifeOS AI
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
                    <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>

                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 p-2 rounded-full border border-border hover:bg-muted/50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-4 h-4" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border mb-1">My Account</div>
                                    <button
                                        onClick={() => router.push("/dashboard/profile")}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" /> Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log In</Link>
                            <Link href="/signup" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background border-b border-border p-4 flex flex-col gap-4">
                    <Link href="/" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/#features" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                    <Link href="/dashboard" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    <hr className="border-border" />
                    <Link href="/login" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                    <Link href="/signup" className="text-sm font-medium text-primary" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </div>
            )}
        </nav>
    );
}
