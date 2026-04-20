"use client";

import { useEffect, useState } from "react";

interface PageLoaderProps {
    children: React.ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (document.readyState === "complete") {
            setIsLoaded(true);
            return;
        }

        const handleLoad = () => setIsLoaded(true);
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, []);

    if (!isLoaded) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-bg z-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
