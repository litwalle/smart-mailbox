import * as React from "react"
import { cn } from "@/lib/utils"
import { Email } from "@/types/mail"
import { SplitScrollView } from "./SplitScrollView"
import { LuReply, LuReplyAll, LuForward } from "react-icons/lu"
import { SegmentedControl } from "@/components/ui/SegmentedControl"

interface MailDetailBodyProps {
    email: Email
}

export function MailDetailBody({ email }: MailDetailBodyProps) {
    // State for Translation Mode
    const [translationMode, setTranslationMode] = React.useState<'original' | 'translation' | 'split'>('original')

    // Reset translation mode when email content changes (or email id)
    React.useEffect(() => {
        setTranslationMode('original')
    }, [email.id])

    return (
        <div className="max-w-4xl mx-auto px-8 pb-8">
            {/* Translation Controls & Body View */}
            <div className="mb-12">
                {email.translatedContent && (
                    <div className="flex items-center justify-between mb-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 sticky top-0 z-10">
                        <div className="flex items-center gap-2 px-2">
                            <span className="material-symbols-outlined text-slate-500 text-[18px]">translate</span>
                            <span className="text-sm font-semibold text-slate-700">Translation View</span>
                        </div>

                        <SegmentedControl
                            value={translationMode}
                            onChange={(val) => setTranslationMode(val as 'original' | 'translation' | 'split')}
                            options={[
                                { value: 'original', label: 'Original' },
                                { value: 'translation', label: 'Translation' },
                                {
                                    value: 'split',
                                    label: 'Contrast'
                                }
                            ]}
                            size="sm"
                        />
                    </div>
                )}

                {/* Content Body - Using SplitScrollView to handle modes */}
                <SplitScrollView
                    email={email}
                    translationMode={translationMode}
                />
            </div>

            {/* Action Area (Reply/Forward) */}
            <div className="flex gap-4 pt-8 border-t border-slate-100">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all">
                    <LuReply className="w-4 h-4" />
                    Reply
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all">
                    <LuReplyAll className="w-4 h-4" />
                    Reply All
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all">
                    <LuForward className="w-4 h-4" />
                    Forward
                </button>
            </div>
        </div>
    )
}
