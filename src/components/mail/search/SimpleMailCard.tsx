import * as React from "react"
import { cn } from "@/lib/utils"
import { Email } from "@/types/mail" // Assuming type location, will verify

interface SimpleMailCardProps {
    email: Email
    onClick?: () => void
}

export function SimpleMailCard({ email, onClick }: SimpleMailCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 p-3 bg-white/60 hover:bg-white rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
        >
            {/* Avatar */}
            {email.from.avatar ? (
                <img
                    src={email.from.avatar}
                    className="h-8 w-8 rounded-full object-cover shrink-0 bg-background-tertiary"
                    alt={email.from.name}
                />
            ) : (
                <div className="h-8 w-8 rounded-full bg-background-secondary border border-comp-divider flex items-center justify-center text-[10px] font-semibold text-font-secondary shrink-0">
                    {email.from.name.charAt(0)}
                </div>
            )}

            <div className="flex flex-col min-w-0">
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {email.from.name}
                </div>
                <div className="text-xs text-slate-600 line-clamp-1 font-medium">
                    {email.subject}
                </div>
            </div>
        </div>
    )
}
