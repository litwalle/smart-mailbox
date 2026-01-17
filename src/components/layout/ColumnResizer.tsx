"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ColumnResizerProps {
    onResize: (newWidth: number) => void;
    className?: string;
    minWidth?: number;
    maxWidth?: number;
    initialWidth?: number;
    isResizing?: boolean;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
}

export function ColumnResizer({
    onResize,
    className,
    isResizing: externalIsResizing = false,
    onResizeStart,
    onResizeEnd,
}: ColumnResizerProps) {
    const [isHovered, setIsHovered] = useState(false);

    const startResize = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onResizeStart?.();

            const startX = e.clientX;
            const startWidth = (e.target as HTMLElement).parentElement?.offsetWidth || 0; // 这里的逻辑可能需要根据实际父容器调整，或者由外部传入当前宽度

            // 为了简化，我们假设 onResize 接收的是差值 delta，或者我们在 effect 中处理
            // 更好的方式是：在 startResize 时记录初始状态，绑定 window mousemove

            const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                // 这里我们实际上不知道当前的宽度，除非从 props 传入或者从 DOM 获取。
                // 为了通用性，通常 Resizer 只负责抛出 movementX 或者 newClientX
                // 但为了简单，我们让父组件处理逻辑，这里主要作为 handle
            };

            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                onResizeEnd?.();
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [onResizeStart, onResizeEnd]
    );

    // 重新设计：Resizer 作为一个纯 UI 组件 + 事件转发
    // 实际的宽度计算逻辑放在 Layout 中可能更合适，或者使用专门的 hook

    return (
        <div
            className={cn(
                "w-1 h-full cursor-col-resize flex flex-col justify-center items-center z-50 hover:bg-blue-500/10 transition-colors group absolute right-0 top-0 bottom-0 touch-none",
                externalIsResizing && "bg-blue-500/20",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={onResizeStart} // 我们在父组件绑定具体的 resize 逻辑
        >
            <div
                className={cn(
                    "w-0.5 h-8 bg-slate-300 rounded-full transition-colors",
                    (isHovered || externalIsResizing) && "bg-blue-500"
                )}
            />
        </div>
    );
}
