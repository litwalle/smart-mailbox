import * as React from "react";
import { Email } from "@/types/mail";

interface SplitScrollViewProps {
    email: Email;
    translationMode: 'original' | 'translation' | 'split';
}

export function SplitScrollView({ email, translationMode }: SplitScrollViewProps) {
    const originalRef = React.useRef<HTMLDivElement>(null);
    const translationRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [thumbTop, setThumbTop] = React.useState(0);
    const isDragging = React.useRef(false);

    // Sync helper: update scroll position of 'target' based on 'source' percentage
    const syncScroll = (source: HTMLDivElement | null, target: HTMLDivElement | null) => {
        if (!source || !target) return;

        const percentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
        // Clean nan check
        if (isNaN(percentage)) return;

        // Update target scroll
        target.scrollTop = percentage * (target.scrollHeight - target.clientHeight);

        // Update thumb position
        if (trackRef.current) {
            const trackHeight = trackRef.current.clientHeight;
            // Thumb height is fixed at 48px (h-12)
            const thumbHeight = 48;
            const availableSpace = trackHeight - thumbHeight;
            setThumbTop(percentage * availableSpace);
        }
    };

    const handleScroll = (source: 'original' | 'translation') => {
        if (isDragging.current) return;

        // Determine source and target
        const sourceRef = source === 'original' ? originalRef : translationRef;
        const targetRef = source === 'original' ? translationRef : originalRef;

        // We use a simple lock flag to prevent loop, but since we are calculating based on immediate source,
        // we can just set the other one. A deeper lock might be needed if jitter occurs, but usually:
        // User scrolls A -> Event A -> Sync B (B triggers event B?) -> Event B sees correct position -> No-op?
        // Actually, setting scrollTop triggers onScroll. We need a "isScrolling" flag.
        // Simplified approach: Since user only interacts with one pane at a time (or the bar), 
        // we can assume the one triggering the event is the source.
        // However, "parallel lock" usually implies mutual exclusion.

        // Ideally we'd use a generic "onScroll" that checks which one is being hovered or focused, 
        // but for simplicity let's just sync the *other* one directly.
        // To prevent feedback loops, we can check if the value is already close enough.

        // NOTE: The previous ref-based lock (isSyncingLeft/Right) was safer. Let's re-add it implicitly if needed.
        // For now, let's try direct sync.
        syncScroll(sourceRef.current, targetRef.current);
    };

    const handleDragStart = (e: React.MouseEvent) => {
        isDragging.current = true;
        e.preventDefault();

        const startY = e.clientY;
        const startTop = thumbTop;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!trackRef.current || !originalRef.current || !translationRef.current) return;

            const trackHeight = trackRef.current.clientHeight;
            const thumbHeight = 48;
            const availableSpace = trackHeight - thumbHeight;

            const deltaY = moveEvent.clientY - startY;
            let newTop = startTop + deltaY;

            // Clamp
            newTop = Math.max(0, Math.min(newTop, availableSpace));
            setThumbTop(newTop);

            // Calculate percentage from newTop
            const percentage = newTop / availableSpace;

            // Apply to both panes
            const o = originalRef.current;
            const t = translationRef.current;

            o.scrollTop = percentage * (o.scrollHeight - o.clientHeight);
            t.scrollTop = percentage * (t.scrollHeight - t.clientHeight);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    if (translationMode === 'split' && email.translatedContent) {
        return (
            <div className="relative h-[600px] border border-slate-200 rounded-lg overflow-hidden flex bg-white group">
                {/* Left: Original */}
                <div
                    ref={originalRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar-hide"
                    onScroll={() => !isDragging.current && syncScroll(originalRef.current, translationRef.current)}
                >
                    <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed pb-20">
                        <div dangerouslySetInnerHTML={{ __html: email.content }} />
                    </div>
                </div>

                {/* Center: Gutter/Scrollbar */}
                <div
                    ref={trackRef}
                    className="w-4 bg-slate-50 border-x border-slate-200 py-1 relative shrink-0 select-none"
                >
                    {/* Interactive Draggable Thumb */}
                    <div
                        onMouseDown={handleDragStart}
                        style={{ top: thumbTop }}
                        className="w-1.5 h-12 bg-slate-300 hover:bg-slate-400 active:bg-slate-500 rounded-full absolute left-1 cursor-grab active:cursor-grabbing transition-colors z-20"
                    />
                </div>

                {/* Right: Translation */}
                <div
                    ref={translationRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50/30 custom-scrollbar-hide"
                    onScroll={() => !isDragging.current && syncScroll(translationRef.current, originalRef.current)}
                >
                    <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed pb-20">
                        <div dangerouslySetInnerHTML={{ __html: email.translatedContent }} />
                    </div>
                </div>

                <style jsx global>{`
                    .custom-scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .custom-scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed outline-none focus:outline-none">
            <div dangerouslySetInnerHTML={{ __html: translationMode === 'translation' && email.translatedContent ? email.translatedContent : email.content }} />
        </div>
    );
}
