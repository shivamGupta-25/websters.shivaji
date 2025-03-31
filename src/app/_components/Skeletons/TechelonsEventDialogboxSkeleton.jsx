"use client"

import { memo } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Enhanced skeleton component with structure matching the actual EventModal component
const TechelonsEventDialogboxSkeleton = memo(() => (
    <Dialog open={true}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] p-0 overflow-hidden w-[95%] mx-auto border-border/40 bg-background/95 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 ease-in-out">
            <DialogTitle className="sr-only">Event Details Loading</DialogTitle>

            {/* Modal content with improved scrolling behavior */}
            <div className="max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-thin">
                {/* Event image skeleton */}
                <div className="h-48 md:h-56 relative overflow-hidden">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute bottom-4 left-4">
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                </div>

                {/* Event content */}
                <div className="p-5 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>

                    {/* Event details section */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                            <div className="space-y-3 w-full">
                                <Skeleton className="h-5 w-1/3" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-4 w-4 mt-1 flex-shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-2/3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-4 w-4 mt-1 flex-shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-2/3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prize section */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-6 rounded-lg" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                        <div className="space-y-3 pl-8">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    </div>

                    {/* Description section */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-6 rounded-lg" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40">
                        <Skeleton className="h-10 flex-1 rounded-lg" />
                        <Skeleton className="h-10 flex-1 rounded-lg opacity-70" />
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
))

TechelonsEventDialogboxSkeleton.displayName = "TechelonsEventDialogboxSkeleton"

export default TechelonsEventDialogboxSkeleton; 