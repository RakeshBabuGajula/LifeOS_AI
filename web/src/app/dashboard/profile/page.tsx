"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Mail, Shield, Settings, CreditCard, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UserProfile {
    email: string;
    full_name: string;
    is_active: boolean;
    is_superuser: boolean;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-primary">Loading Profile...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-8"
            >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-xl shadow-primary/25">
                    <User className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{user?.full_name || "User"}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {user?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full border border-green-500/20">
                            Active Account
                        </span>
                        {user?.is_superuser && (
                            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs font-medium rounded-full border border-purple-500/20 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Admin
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" /> Account Settings
                            </CardTitle>
                            <CardDescription>Manage your personal information and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <input
                                        disabled
                                        value={user?.full_name || ""}
                                        className="w-full px-3 py-2 bg-muted/50 border rounded-md text-sm text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <input
                                        disabled
                                        value={user?.email || ""}
                                        className="w-full px-3 py-2 bg-muted/50 border rounded-md text-sm text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button variant="outline" disabled className="w-full">Edit Profile (Coming Soon)</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" /> Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm">Email Digest</span>
                                <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-primary rounded-full absolute right-0 shadow-sm" /></div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm">Product Updates</span>
                                <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-gray-400 rounded-full absolute left-0 shadow-sm" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="bg-destructive/5 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="destructive"
                                className="w-full flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" /> Log Out
                            </Button>
                            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="p-3 bg-primary/10 rounded-full inline-flex text-primary">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Upgrade to Pro</h3>
                                <p className="text-sm text-muted-foreground mt-1">Unlock unlimited AI generation and advanced analytics.</p>
                            </div>
                            <Button className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                                Upgrade Plan
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
