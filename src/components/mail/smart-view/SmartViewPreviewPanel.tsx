import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { SmartFolderConfig } from "./types"

interface SmartViewPreviewPanelProps {
    folders: SmartFolderConfig[]
}

export function SmartViewPreviewPanel({ folders }: SmartViewPreviewPanelProps) {
    // Mock Sources
    const sources = [
        { id: 's1', name: 'Liam Smith', subject: 'Re: Interest in Enterprise Plan', tag: 'Lead', color: 'text-orange-500' },
        { id: 's2', name: 'Adobe Sign', subject: 'Please sign: Service Agreement v2', tag: 'Contract', color: 'text-green-500' },
        { id: 's3', name: 'Sarah Jenkins', subject: 'Following up on our demo last week', tag: 'Follow-up', color: 'text-blue-500' },
    ]

    return (
        <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col z-0">
            {/* Header Badge */}
            <div className="absolute top-6 right-8 z-20">
                <div className="bg-white shadow-sm border border-comp-divider rounded-full px-3 py-1 text-xs font-medium text-brand flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                    </span>
                    Live Preview
                </div>
            </div>

            {/* Visualization Container */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                {/* Background Grid - Solid subtle background */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="flex w-full max-w-4xl justify-between items-center z-10 gap-16 relative">

                    {/* LEFT: Sources Column */}
                    <div className="flex flex-col gap-4 w-[280px]">
                        <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-2">Inbox Sources</div>
                        {sources.map((source, i) => (
                            <motion.div
                                key={source.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-lg p-3 border border-comp-divider shadow-sm flex flex-col gap-1 relative overflow-hidden group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-font-primary">{source.name}</span>
                                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded bg-background-secondary", source.color)}>{source.tag}</span>
                                </div>
                                <div className="text-xs text-font-secondary truncate">{source.subject}</div>

                                {/* Connection Dot */}
                                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-comp-divider rounded-full translate-x-1/2" />
                            </motion.div>
                        ))}
                    </div>

                    {/* CENTER: Connection Lines Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                            <AnimatePresence>
                                {folders.length > 0 && sources.map((source, i) => {
                                    // Simple mapping logic: 
                                    const targetFolderIndex = i % folders.length;
                                    const targetFolder = folders[targetFolderIndex];
                                    if (!targetFolder) return null;

                                    // Dynamic calculation based on assumption of list height
                                    // Source Item Center Y (relative to container): 
                                    // Top padding (50 roughly) + index * (card height ~70 + gap ~16) 
                                    // Let's approximate card height + gap as 88px
                                    const startY = 80 + (i * 88);
                                    const endY = 80 + (targetFolderIndex * 88);

                                    // We're drawing in a container that spans the whole flex area
                                    // The left column ends at x=280 approx (let's say line starts at 280)
                                    // The right column starts at x=Width-280 (let's say 280 from right)
                                    // Total width approx 896px (max-w-4xl) -> gap is 16 = 64px ... wait
                                    // gap-16 is 4rem = 64px? No gap-16 is 4rem.
                                    // Actually let's just hardcode some relative coordinates for the visualization
                                    // since we don't have real refs.

                                    const startX = 280;
                                    const endX = 616; // 896 - 280

                                    return (
                                        <g key={`connection-${i}-${targetFolder.id}`}>
                                            {/* Static Path */}
                                            <motion.path
                                                d={`M ${startX} ${startY} C ${startX + 150} ${startY}, ${endX - 150} ${endY}, ${endX} ${endY}`}
                                                fill="none"
                                                stroke="#cbd5e1"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                            />
                                            {/* Particle */}
                                            <circle r="3" fill="#6366f1">
                                                <animateMotion
                                                    dur={`${2 + i * 0.5}s`}
                                                    repeatCount="indefinite"
                                                    path={`M ${startX} ${startY} C ${startX + 150} ${startY}, ${endX - 150} ${endY}, ${endX} ${endY}`}
                                                />
                                            </circle>
                                        </g>
                                    )
                                })}
                            </AnimatePresence>
                        </svg>
                    </div>

                    {/* RIGHT: Target Folders Column */}
                    <div className="flex flex-col gap-4 w-[280px]">
                        <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-2">Target Folders</div>
                        <AnimatePresence mode="popLayout">
                            {folders.length > 0 ? (
                                folders.map((folder, i) => (
                                    <motion.div
                                        key={folder.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-lg p-3 border border-comp-divider shadow-sm flex items-center gap-3 relative z-10"
                                    >
                                        <div className={cn("size-8 rounded flex items-center justify-center text-white", folder.color.replace('text-', 'bg-').replace('600', '500'))}>
                                            <span className="material-symbols-outlined text-[18px]">{folder.icon}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-font-primary">{folder.name}</span>
                                            <span className="text-[10px] text-font-tertiary">~{(12 + i * 4)} items match</span>
                                        </div>

                                        {/* Connection Dot */}
                                        <div className="absolute top-1/2 -left-1 w-2 h-2 bg-brand rounded-full -translate-x-1/2 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-font-tertiary text-sm py-10 bg-white/50 border border-dashed border-comp-divider rounded-lg"
                                >
                                    Add folders to see preview
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Footer Stats */}
            <div className="h-16 border-t border-comp-divider bg-white px-8 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-20">
                <div className="flex items-center gap-2 text-sm text-font-secondary">
                    <span className="material-symbols-outlined text-brand text-[18px]">auto_awesome</span>
                    <span className="font-medium text-font-primary">AI Logic Active:</span>
                    <span>Analyzing incoming mail based on content matching.</span>
                </div>
            </div>
        </div>
    )
}
