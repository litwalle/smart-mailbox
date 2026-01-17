import { format, getHours, getMinutes } from "date-fns";

interface CurrentTimeIndicatorProps {
    currentTime: Date;
    startHour: number;
    endHour: number;
    hourHeight: number;
    variant: 'capsule' | 'line';
}

export function CurrentTimeIndicator({
    currentTime,
    startHour,
    endHour,
    hourHeight,
    variant
}: CurrentTimeIndicatorProps) {
    const h = getHours(currentTime);
    const m = getMinutes(currentTime);

    if (h < startHour || h > endHour) return null;

    const top = ((h - startHour) * 60 + m) / 60 * hourHeight;

    if (variant === 'capsule') {
        return (
            <div
                className="absolute translate-x-1/2 z-[35] -translate-y-1/2 flex items-center justify-center pointer-events-none"
                style={{ top: top, right: 34 }}
            >
                {/* Connecting Tail - Unified centering */}
                <div className="absolute left-1/2 w-[34px] h-px bg-red-500 top-1/2 -translate-y-1/2" />

                {/* Text Pill */}
                <div className="relative z-10 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center justify-center">
                    {format(currentTime, 'HH:mm')}
                </div>
            </div>
        );
    }

    if (variant === 'line') {
        return (
            <div
                className="absolute right-0 h-px bg-red-500 z-[35] -translate-y-1/2 pointer-events-none"
                style={{ top: top, left: 0 }}
            />
        );
    }

    return null;
}
