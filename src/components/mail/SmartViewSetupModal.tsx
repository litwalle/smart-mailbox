"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { useMailStore } from "@/store/mailStore"
import { Button } from "@/components/ui/Button"
import { SmartViewConfigPanel } from "./smart-view/SmartViewConfigPanel"
import { SmartViewViewListPanel } from "./smart-view/SmartViewViewListPanel"
import { SmartViewEmailPreviewPanel } from "./smart-view/SmartViewEmailPreviewPanel"
import { useSmartViewConfig } from "./smart-view/useSmartViewConfig"

interface SmartViewSetupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SmartViewSetupModal({ open, onOpenChange }: SmartViewSetupModalProps) {
    const { addFolder } = useMailStore()

    const {
        mode,
        setMode,
        selectedTemplateId,
        setSelectedTemplateId,
        folders,
        updateFolder,
        removeFolder,
        selectedViewId,
        setSelectedViewId,

        // Custom mode
        customViewName,
        setCustomViewName,
        customRule,
        setCustomRule,
        rules,
        addRule,
        removeRule,
        isGenerating,

        // Helpers
        getMatchingEmails,
        templates
    } = useSmartViewConfig()

    // Calculate match counts for all folders
    const matchCounts = React.useMemo(() => {
        const counts: Record<string, number> = {}
        folders.forEach(folder => {
            counts[folder.id] = getMatchingEmails(folder.id, 5).length
        })
        return counts
    }, [folders, getMatchingEmails])

    // Get emails for selected view
    const selectedViewEmails = React.useMemo(() => {
        if (!selectedViewId) return []
        return getMatchingEmails(selectedViewId, 5)
    }, [selectedViewId, getMatchingEmails])

    const selectedViewName = React.useMemo(() => {
        const folder = folders.find(f => f.id === selectedViewId)
        return folder?.name || ''
    }, [folders, selectedViewId])

    const handleApply = () => {
        // Logic to add folders to global mail store
        folders.forEach(folder => {
            addFolder({
                id: folder.id,
                name: folder.name,
                type: 'smart',
                icon: folder.icon,
                color: folder.color.replace('palette-', 'text-palette-'),
                unreadCount: matchCounts[folder.id] || 0
            })
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-6xl h-[85vh] p-0 gap-0 overflow-hidden bg-background-primary rounded-xl shadow-2xl border-none flex flex-col">

                {/* Header */}
                <div className="h-14 border-b border-comp-divider px-6 flex items-center justify-between bg-white shrink-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        </div>
                        <span className="font-bold text-lg text-font-primary">创建智能视图</span>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-icon-tertiary hover:text-icon-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Main Content: Three-Column Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT: Config Panel */}
                    <SmartViewConfigPanel
                        mode={mode}
                        setMode={setMode}
                        templates={templates}
                        selectedTemplateId={selectedTemplateId}
                        setSelectedTemplateId={setSelectedTemplateId}
                        customViewName={customViewName}
                        setCustomViewName={setCustomViewName}
                        customRule={customRule}
                        setCustomRule={setCustomRule}
                        rules={rules}
                        addRule={addRule}
                        removeRule={removeRule}
                        isGenerating={isGenerating}
                    />

                    {/* MIDDLE: View List Panel */}
                    <SmartViewViewListPanel
                        folders={folders}
                        selectedViewId={selectedViewId}
                        onSelectView={setSelectedViewId}
                        onUpdateFolder={updateFolder}
                        onRemoveFolder={removeFolder}
                        matchCounts={matchCounts}
                    />

                    {/* RIGHT: Email Preview Panel */}
                    <SmartViewEmailPreviewPanel
                        emails={selectedViewEmails}
                        viewName={selectedViewName}
                    />
                </div>

                {/* Footer Actions */}
                <div className="h-16 border-t border-comp-divider bg-white px-8 flex items-center justify-end gap-3 z-30 shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="bg-brand hover:bg-brand/90 text-white px-6 shadow-md hover:shadow-lg transition-all"
                        disabled={folders.length === 0}
                    >
                        创建视图
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
