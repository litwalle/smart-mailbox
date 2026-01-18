import * as React from "react"
import { Email, User } from "@/types/mail"
import { Globe, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface MailRecipientDetailsProps {
    email: Email
    currentUserId: string
    onClose: () => void
}

// Helper to identify external users
const isExternalUser = (emailAddress: string) => {
    return !emailAddress.endsWith("@company.com") && !emailAddress.endsWith("@spacex.com"); // "spacex" is "partner" but treating as external for icon demo
}

function RecipientName({ user, isExternal, isLast }: { user: User; isExternal?: boolean; isLast: boolean }) {
    // Check if truly external for the icon (company.com is internal)
    const showGlobe = isExternal ?? isExternalUser(user.email);

    return (
        <span className="inline-flex items-center text-sm text-font-primary font-medium">
            {showGlobe && (
                <Globe className="w-3.5 h-3.5 text-confirm mr-1 stroke-[1.5px]" />
            )}
            {user.name}
            {!isLast && <span className="mx-1 text-font-fourth">;</span>}
        </span>
    )
}

function DetailRow({ label, users }: { label: string, users: User[] }) {
    if (!users || users.length === 0) return null;
    return (
        <div className="flex items-baseline gap-4">
            <div className="w-12 shrink-0 text-xs font-semibold text-font-tertiary uppercase text-left leading-relaxed">
                {label}
            </div>
            <div className="flex-1 flex flex-wrap gap-y-1 leading-relaxed">
                {users.map((u, i) => (
                    <RecipientName
                        key={u.id}
                        user={u}
                        isLast={i === users.length - 1}
                    />
                ))}
            </div>
        </div>
    )
}

export function MailRecipientDetails({ email, currentUserId, onClose }: MailRecipientDetailsProps) {
    return (
        <div className="w-full bg-background-secondary/80 backdrop-blur-sm rounded-xl border border-comp-divider p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-3">
                {/* FROM */}
                <div className="flex items-baseline gap-4">
                    <div className="w-12 shrink-0 text-xs font-semibold text-font-tertiary uppercase text-left leading-relaxed">
                        From
                    </div>
                    <div className="flex-1">
                        <RecipientName user={email.from} isLast={true} />
                    </div>
                </div>

                {/* TO */}
                <DetailRow label="To" users={email.to} />

                {/* CC */}
                <DetailRow label="Cc" users={email.cc || []} />

                {/* BCC */}
                <DetailRow label="Bcc" users={email.bcc || []} />

                {/* Metadata Footer */}
                <div className="pt-3 mt-3 border-t border-comp-divider flex items-center gap-6 text-xs text-font-tertiary">
                    {email.size && (
                        <div className="flex items-center gap-1.5">
                            <span>Size:</span>
                            <span className="text-font-secondary">{email.size}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <span>Security:</span>
                        <span className="text-confirm flex items-center gap-0.5">
                            <Lock className="w-3 h-3 stroke-[1.5px]" />
                            Standard encryption (TLS)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
