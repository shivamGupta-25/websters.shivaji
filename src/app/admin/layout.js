"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Menu, X, Home, FileText, Users, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileView = window.innerWidth < 1024;
            setIsMobile(isMobileView);
            setIsCollapsed(isMobileView);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [pathname, isMobile]);

    // Control body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = isMobile && sidebarOpen ? 'hidden' : 'auto';

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobile, sidebarOpen]);

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Home Page Content", href: "/admin/main-content", icon: FileText },
        { name: "Techelons Page Content", href: "/admin/techelons-page-content", icon: FileText },
        { name: "Workshop", href: "/admin/workshop", icon: Users },
        { name: "Techelons Events", href: "/admin/techelons-events", icon: Users },
        { name: "Techelons Registrations", href: "/admin/techelons-registrations", icon: Users },
        { name: "Unused Files", href: "/admin/unused-files", icon: FileText },
        { name: "Footer", href: "/admin/footer", icon: FileText },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/admin/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            toast.success("Logged out successfully");
            // Force a hard navigation to ensure cookies are cleared properly
            window.location.href = "/admin/login";
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300",
                isCollapsed && !isMobile ? "w-16" : "w-64",
                isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
            )}>
                <div className="flex h-14 items-center border-b px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={toggleSidebar}
                    >
                        {isMobile && sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    {(!isCollapsed || (isMobile && sidebarOpen)) && (
                        <Link href="/" className="font-semibold">
                            Websters Admin
                        </Link>
                    )}
                </div>

                <ScrollArea className="flex-1">
                    <nav className="space-y-1 p-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent hover:text-accent-foreground",
                                        isCollapsed && !isMobile && "justify-center"
                                    )}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {(!isCollapsed || (isMobile && sidebarOpen)) && (
                                        <span className="ml-2 truncate">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>

                <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            isCollapsed && !isMobile && "justify-center"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {(!isCollapsed || (isMobile && sidebarOpen)) && (
                            <span className="ml-2">Logout</span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile header */}
            {isMobile && (
                <div className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center border-b bg-background px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="mr-4"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold">Websters Admin</span>
                </div>
            )}

            {/* Main content */}
            <div className={cn(
                "flex-1 transition-all duration-300",
                isMobile ? "mt-14 ml-0" : (isCollapsed ? "ml-16" : "ml-64")
            )}>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}