import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    onClear: () => void
    className?: string
    placeholder?: string
}

export function SearchInput({
    value,
    onChange,
    onSearch,
    onClear,
    className,
    placeholder = "询问 AI..."
}: SearchInputProps) {
    const [isFocused, setIsFocused] = React.useState(false)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch()
        }
    }

    return (
        <div className={cn("relative group", className)}>
            {/* Rainbow Border Container */}
            <div
                className={cn(
                    "absolute -inset-[2px] rounded-lg opacity-0 transition-opacity duration-300",
                    isFocused && "opacity-50 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-xy bg-[length:200%_200%]"
                )}
                style={{
                    zIndex: 0
                }}
            />

            {/* Input Container */}
            <div className={cn(
                "relative z-10 flex items-center w-full h-[44px] bg-slate-100 border border-slate-200 rounded-lg transition-all duration-300",
                isFocused ? "bg-white border-transparent" : "hover:bg-slate-50"
            )}>
                {/* Search Icon / Sparkles */}
                <div className="pl-3 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[20px] text-icon-tertiary">auto_awesome</span>
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 h-full bg-transparent border-none outline-none px-3 text-base text-slate-800 placeholder:text-slate-400"
                />

                {/* Close/Clear Button & Mic */}
                <div className="pr-2 flex items-center gap-1">
                    {(value || isFocused) && (
                        <button
                            onClick={onClear}
                            className="flex items-center justify-center p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-200"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    )}

                    {!value && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 min-w-0 px-0 text-icon-tertiary hover:text-brand">
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
