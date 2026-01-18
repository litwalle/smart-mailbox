"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMailStore } from "@/store/mailStore";
import { ColumnResizer } from "./ColumnResizer";

interface ThreeColumnLayoutProps {
    sidebar: React.ReactNode;
    sidebarCollapsed?: React.ReactNode;
    list: React.ReactNode;
    detail: React.ReactNode;
    defaultListWidth?: number;
    minListWidth?: number;
    maxListWidth?: number;
}

export function ThreeColumnLayout({
    sidebar,
    list,
    detail,
    defaultListWidth = 380,
    minListWidth = 300,
    maxListWidth = 600,
}: ThreeColumnLayoutProps) {
    // A栏状态
    const { isSidebarCollapsed } = useMailStore();

    // Calculate default widths based on window size
    // We use a ref to track if we've initialized to avoid layout jumps
    // but here specific logic is requested: Default 35%, Max 50%.
    const [listWidth, setListWidth] = useState(() => {
        // User requested Min 500, so we default to 500 or 35% if > 500.
        // Actually, let's just default to a safe 500 to ensure we meet the min requirement.
        return 500;
    });

    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize width on mount and handle window resize constraints
    useEffect(() => {
        const updateWidths = () => {
            const width = window.innerWidth;
            const targetDefault = width * 0.35;
            // If current width is wildly off (like initialized with SSR default), sync it
            // Or if we want to be responsive. For now, let's just respect the constraints during resize.
            // But we can reset to 35% on very first load if needed.
            // Since we initialized state lazily above, that usually handles the first render on client.
        };

        window.addEventListener('resize', updateWidths);
        updateWidths(); // Initial check
        return () => window.removeEventListener('resize', updateWidths);
    }, []);

    // 处理拖拽
    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    // Auto-resize for Calendar Mode
    const { selectedFolderId } = useMailStore();

    useEffect(() => {
        if (selectedFolderId === 'calendar' && detail && containerRef.current) {
            // Calendar Mode with Detail: B=60%, C=40%
            const sidebarWidth = isSidebarCollapsed ? 64 : 320;
            const availableWidth = window.innerWidth - sidebarWidth;
            const targetWidth = availableWidth * 0.6;
            setListWidth(targetWidth);
        }
    }, [selectedFolderId, detail, isSidebarCollapsed]);

    // Resize logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            // Simple width calculation
            const sidebarWidth = isSidebarCollapsed ? 64 : 320;
            let newWidth = e.clientX - sidebarWidth;

            // Constraints (User Requested: Min 500, Max 800)
            const effectiveMin = 500;
            const effectiveMax = 800;

            if (newWidth < effectiveMin) newWidth = effectiveMin;
            if (newWidth > effectiveMax) newWidth = effectiveMax;

            setListWidth(newWidth);
        };

        const handleMouseUp = () => {
            stopResizing();
        };

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "none";
            document.body.style.cursor = "col-resize";
        } else {
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [isResizing, isSidebarCollapsed, minListWidth, maxListWidth, stopResizing]);


    return (
        <div
            ref={containerRef}
            className="flex h-screen w-full overflow-hidden bg-white"
        >
            {/* A栏: Sidebar */}
            <motion.aside
                initial={{ width: 320 }}
                animate={{ width: isSidebarCollapsed ? 64 : 320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-shrink-0 border-r-[0.5px] border-comp-divider bg-background-secondary relative z-20 flex flex-col h-full"
            >
                {/* 
                  Simplified Structure:
                  We just render the 'sidebar' prop. 
                  The Sidebar component itself now handles 'isCollapsed' styling and layout internally.
                  This avoid DOM swapping and keeps state preserved.
                */}
                <div className="flex-1 overflow-hidden h-full">
                    {sidebar}
                </div>
            </motion.aside>

            {/* B栏: List */}
            <div
                style={{ width: detail ? listWidth : undefined }}
                className={cn(
                    "border-r border-comp-divider bg-background-primary relative flex flex-col h-full z-10",
                    detail ? "flex-shrink-0" : "flex-1"
                )}
            >
                <div className="flex-1 overflow-hidden h-full">
                    {list}
                </div>

                {/* 拖拽手柄: 仅当有 C 栏时显示 */}
                {detail && (
                    <ColumnResizer
                        onResize={(val) => { }} // 逻辑在 useEffect 处理
                        onResizeStart={startResizing}
                        isResizing={isResizing}
                        className="absolute right-0 top-0 bottom-0 translate-x-1/2 w-4 hover:w-4 flex justify-center opacity-0 hover:opacity-100 transition-opacity"
                    />
                )}
            </div>

            {/* C栏: Detail (Conditionally Rendered) */}
            {detail && (
                <main className="flex-1 min-w-0 bg-background-base h-full overflow-hidden flex flex-col">
                    {detail}
                </main>
            )}
        </div>
    );
}
