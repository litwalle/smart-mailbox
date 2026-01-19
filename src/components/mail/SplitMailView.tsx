import * as React from "react";
import { Email, Todo } from "@/types/mail";
import { MailDetailHeader } from "./MailDetailHeader";
import { MeetingDetail } from "./MeetingDetail";
import { useMailStore } from "@/store/mailStore";
import { ReplySuggestionList } from "./ReplySuggestionList";

interface SplitMailViewProps {
    email: Email;
    translationMode: 'original' | 'translation' | 'split';
}

export function SplitMailView({ email, translationMode }: SplitMailViewProps) {
    const originalRef = React.useRef<HTMLDivElement>(null);
    const translationRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);

    const [thumbTop, setThumbTop] = React.useState(0);
    const [thumbHeight, setThumbHeight] = React.useState(48); // Default fallback
    const isDragging = React.useRef(false);

    const { toggleStar } = useMailStore();

    // Helper to create translated email object
    const translatedEmail = React.useMemo(() => {
        if (translationMode === 'original') return email;
        return {
            ...email,
            subject: email.translatedSubject || email.subject,
            aiSummary: email.translatedSummary || email.aiSummary,
            aiTodos: email.translatedTodos || email.aiTodos,
            content: email.translatedContent || email.content
        } as Email;
    }, [email, translationMode]);

    // Recalculate Scrollbar Metrics
    const updateScrollMetrics = React.useCallback(() => {
        const source = originalRef.current || translationRef.current;
        if (!source || !trackRef.current) return;

        const { clientHeight, scrollHeight, scrollTop } = source;
        const trackHeight = trackRef.current.clientHeight;

        // 1. Calculate adaptive thumb height
        // ratio = viewport / total_content
        const ratio = clientHeight / scrollHeight;
        // thumbHeight = ratio * trackHeight. Clamp to min 30px.
        let newThumbHeight = ratio * trackHeight;
        if (newThumbHeight < 30) newThumbHeight = 30;
        if (newThumbHeight > trackHeight) newThumbHeight = trackHeight; // Should handle noscroll case?

        setThumbHeight(newThumbHeight);

        // 2. Calculate thumb position based on scroll percentage
        // maxScroll = scrollHeight - clientHeight
        // maxThumbTop = trackHeight - thumbHeight
        // percentage = scrollTop / maxScroll
        // top = percentage * maxThumbTop

        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) {
            setThumbTop(0);
            return;
        }

        const percentage = scrollTop / maxScroll;
        const maxThumbTop = trackHeight - newThumbHeight;
        setThumbTop(percentage * maxThumbTop);

    }, [translationMode, email]); // Update when content changes

    // Update metrics on resize or content change
    React.useLayoutEffect(() => {
        updateScrollMetrics();
        window.addEventListener('resize', updateScrollMetrics);
        return () => window.removeEventListener('resize', updateScrollMetrics);
    }, [updateScrollMetrics]);


    // Sync helper: update scroll position of 'target' based on 'source' metrics explicitly
    // This is called during SCROLL event
    const syncScroll = (source: HTMLDivElement | null, target: HTMLDivElement | null) => {
        if (!source) return;

        // Update Thumb Position directly
        const { clientHeight, scrollHeight, scrollTop } = source;
        if (!trackRef.current) return;

        const trackHeight = trackRef.current.clientHeight;
        const maxScroll = scrollHeight - clientHeight;

        // Safety: if no scroll needed
        if (maxScroll <= 0) {
            setThumbTop(0);
            return;
        }

        // Calculate thumb top
        const percentage = scrollTop / maxScroll;

        // We need the CURRENT thumb height to be accurate. 
        // We could rely on state `thumbHeight`, but purely functional is better if possible.
        // Let's rely on the state `thumbHeight` which should be stable during a scroll interaction unless content resizes.
        const maxThumbTop = trackHeight - thumbHeight;
        setThumbTop(percentage * maxThumbTop);

        // Sync Target
        if (target) {
            target.scrollTop = percentage * (target.scrollHeight - target.clientHeight);
        }
    };

    const handleDragStart = (e: React.MouseEvent) => {
        isDragging.current = true;
        e.preventDefault();

        const startY = e.clientY;
        const startTop = thumbTop;
        const currentThumbHeight = thumbHeight; // Capture current height

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!trackRef.current || !originalRef.current || !translationRef.current) return;

            const trackHeight = trackRef.current.clientHeight;
            const availableSpace = trackHeight - currentThumbHeight; // Use captured height

            if (availableSpace <= 0) return;

            const deltaY = moveEvent.clientY - startY;
            let newTop = startTop + deltaY;

            // Clamp
            newTop = Math.max(0, Math.min(newTop, availableSpace));
            setThumbTop(newTop);

            // Calculate percentage from newTop relative to available space
            const percentage = newTop / availableSpace;

            // Apply to both panes
            const o = originalRef.current;
            const t = translationRef.current;

            // We need to calculate scroll position
            // scrollTop = percentage * (scrollHeight - clientHeight)

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

    // Render Content Inner Helper - supports both regular and meeting emails

    // Render Content Inner Helper - supports both regular and meeting emails
    const renderContent = (e: Email, mode: 'original' | 'translation' | 'split') => {
        const isMeeting = e.meetingRequest || e.labels?.includes('Meeting');

        return (
            <div className="pb-20">
                <MailDetailHeader email={e} onToggleStar={toggleStar} />
                {isMeeting && e.meetingRequest ? (
                    <MeetingDetail email={e} translationMode={mode === 'split' ? (e === email ? 'original' : 'translation') : mode} />
                ) : (
                    <div className="max-w-4xl mx-auto px-8 pb-8">
                        <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: e.content }} />
                        </div>
                    </div>
                )}

                {/* Reply Suggestions - Only show for original email to avoid duplication in split view? 
                    Actually, let's show in both or just original. 
                    If split view, maybe only on left? 
                    Let's allow it in all views for now, as it's useful context. 
                */}
                <ReplySuggestionList email={e} />
            </div>
        );
    };

    // --- SPLIT MODE ---
    if (translationMode === 'split') {
        const tEmail = {
            ...email,
            subject: email.translatedSubject || email.subject,
            aiSummary: email.translatedSummary || email.aiSummary,
            aiTodos: email.translatedTodos || email.aiTodos,
            content: email.translatedContent || email.content
        } as Email;

        return (
            <div className="flex-1 flex overflow-hidden bg-background-primary border-comp-divider group/split">
                {/* Left: Original */}
                <div
                    ref={originalRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar-hide border-r border-comp-divider"
                    onScroll={() => !isDragging.current && syncScroll(originalRef.current, translationRef.current)}
                >
                    {renderContent(email, 'original')}
                </div>

                {/* Center: Gutter/Scrollbar */}
                <div
                    ref={trackRef}
                    className="w-3 bg-background-secondary border-x border-comp-divider py-0.5 relative shrink-0 select-none z-20 flex justify-center"
                >
                    {/* Interactive Draggable Thumb */}
                    {/* Only show if content is scrollable (thumbHeight < trackHeight roughly, or just check ratio) */}
                    <div
                        onMouseDown={handleDragStart}
                        style={{ top: thumbTop, height: thumbHeight }}
                        className={`w-1.5 bg-background-fourth hover:bg-background-fourth/80 active:bg-background-fourth rounded-full absolute cursor-grab active:cursor-grabbing transition-colors ${thumbHeight >= (trackRef.current?.clientHeight || 9999) ? 'hidden' : ''}`}
                    />
                </div>

                {/* Right: Translation */}
                <div
                    ref={translationRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden bg-background-secondary/30 custom-scrollbar-hide"
                    onScroll={() => !isDragging.current && syncScroll(translationRef.current, originalRef.current)}
                >
                    {renderContent(tEmail, 'translation')}
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

    // --- SINGLE MODE (Original or Translated) ---
    return (
        <div className="flex-1 overflow-y-auto bg-background-primary">
            {renderContent(translatedEmail, translationMode)}
        </div>
    );
}
