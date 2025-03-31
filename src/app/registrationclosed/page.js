"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

const Registration = () => {
    const [isExiting, setIsExiting] = useState(false)
    const router = useRouter()

    const handleExit = () => {
        setIsExiting(true)
        setTimeout(() => {
            router.push("/")
        }, 500)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <AnimatePresence mode="wait">
                {!isExiting && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-xl"
                    >
                        <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
                            Oops! Registration is closed😕
                        </h1>
                        <p className="mb-6 text-lg text-gray-600">See you next time!</p>

                        <div className="mb-6">
                            <p className="mb-3 text-gray-700">Follow us to never miss an update!</p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href="https://www.instagram.com/websters.shivaji/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full transition-colors hover:bg-purple-100"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/company/websters-shivaji-college/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full transition-colors hover:bg-indigo-100"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Button
                            className="w-full font-semibold"
                            onClick={handleExit}
                        >
                            Back to Home page
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Registration