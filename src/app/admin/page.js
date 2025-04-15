"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Calendar, Award, DollarSign, BarChart } from "lucide-react";

export default function AdminDashboard() {
    // Management cards configuration
    const managementCards = [
        {
            title: "Content Management",
            description: "Update website content like banner, about section, and more",
            icon: <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />,
            iconBg: "bg-blue-100",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
            details: "Edit text, images, and other content displayed on the website. Changes will be reflected immediately.",
            link: "/admin/main-content",
        },
        {
            title: "Workshop Management",
            description: "Manage workshop details and registration",
            icon: <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />,
            iconBg: "bg-purple-100",
            buttonColor: "bg-purple-600 hover:bg-purple-700",
            details: "Update workshop information, registration status, and other details. Control workshop visibility and settings.",
            link: "/admin/workshop",
        },
        {
            title: "Events Management",
            description: "Manage Techelons fest details and events",
            icon: <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />,
            iconBg: "bg-amber-100",
            buttonColor: "bg-amber-600 hover:bg-amber-700",
            details: "Update Techelons fest information, manage events, registration settings, and other details for the tech fest.",
            link: "/admin/techelons-events",
        },
        {
            title: "Sponsors Management",
            description: "Manage event sponsors and partnerships",
            icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />,
            iconBg: "bg-green-100",
            buttonColor: "bg-green-600 hover:bg-green-700",
            details: "Add, edit, or remove event sponsors. Update sponsor logos, website links, and display information.",
            link: "/admin/sponsors",
        },
        {
            title: "Analytics Dashboard",
            description: "View insights and statistics about registrations and events",
            icon: <BarChart className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />,
            iconBg: "bg-indigo-100",
            buttonColor: "bg-indigo-600 hover:bg-indigo-700",
            details: "Access detailed analytics and visualizations about event registrations, workshop participation, and more.",
            link: "/admin/analytics",
        }
    ];

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
            {/* Welcome Banner */}
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-3 sm:p-4 md:p-6 shadow-lg mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white">Welcome back, Admin</h1>
                <p className="mt-1 text-[10px] sm:text-sm text-white/90 max-w-full sm:max-w-lg">
                    Manage your website content and settings from this dashboard
                </p>
            </div>

            {/* Main Management Cards */}
            <section className="mt-4 sm:mt-6 flex-grow">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-center">Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {managementCards.map((card, index) => (
                        <Card
                            key={index}
                            className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                        >
                            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 lg:p-5">
                                <div className={`p-1 sm:p-1.5 w-fit rounded-lg ${card.iconBg} mb-1 sm:mb-2`}>
                                    {card.icon}
                                </div>
                                <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">{card.title}</CardTitle>
                                <CardDescription className="text-[10px] sm:text-xs md:text-sm">
                                    {card.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-3 sm:px-4 lg:px-5 py-1 flex-grow">
                                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{card.details}</p>
                            </CardContent>
                            <CardFooter className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 pt-1 sm:pt-2">
                                <Link href={card.link} className="w-full">
                                    <Button className={`w-full ${card.buttonColor} text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4`}>
                                        <span className="flex items-center justify-center w-full">
                                            <span className="truncate">Manage {card.title.split(" ")[0]}</span>
                                            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        </span>
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}