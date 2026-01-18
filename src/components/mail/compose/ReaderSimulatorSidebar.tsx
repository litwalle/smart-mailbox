import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface ReaderSimulatorSidebarProps {
    mockData?: any
}

export function ReaderSimulatorSidebar({ mockData }: ReaderSimulatorSidebarProps) {
    const [selectedPersona, setSelectedPersona] = React.useState('cfo')

    const personas = [
        { id: 'cfo', name: 'Sarah Chen', role: 'CFO', avatar: 'face_3', mood: 'Critical', color: 'text-warning', bg: 'bg-warning/10' },
        { id: 'pm', name: 'Mike Ross', role: 'Project Manager', avatar: 'face_6', mood: 'Busy', color: 'text-palette-10', bg: 'bg-palette-10/10' },
        { id: 'cto', name: 'David Kim', role: 'CTO', avatar: 'face_2', mood: 'Neutral', color: 'text-brand', bg: 'bg-brand/10' },
    ]

    const activePersona = personas.find(p => p.id === selectedPersona)

    return (
        <div className="flex flex-col h-full bg-background-secondary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-comp-divider bg-background-primary">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand">psychology</span>
                    <span className="font-semibold text-font-primary">Reader Simulator</span>
                </div>
            </div>

            {/* Persona Switcher */}
            <div className="p-4 border-b border-comp-divider bg-background-primary">
                <label className="text-xs font-semibold text-font-tertiary uppercase tracking-widest mb-3 block">Simulate Perspective</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {personas.map(persona => (
                        <button
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona.id)}
                            className={`
                                flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all border
                                ${selectedPersona === persona.id
                                    ? 'bg-comp-emphasize-tertiary border-brand/20 ring-1 ring-brand/20'
                                    : 'bg-background-primary border-comp-divider hover:border-brand/30 hover:bg-background-secondary'
                                }
                            `}
                        >
                            <span className="material-symbols-outlined text-2xl text-icon-secondary">{persona.avatar}</span>
                            <span className="text-[10px] font-medium text-font-secondary truncate w-full text-center">{persona.role}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Simulation Result */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Mood Prediction */}
                <Card className="p-4 border-comp-divider shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-font-secondary uppercase">Predicted Reaction</span>
                        <span className="text-xs text-font-tertiary">85% Confidence</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activePersona?.bg}`}>
                            <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                        </div>
                        <div>
                            <div className={`font-bold ${activePersona?.color}`}>{activePersona?.mood}</div>
                            <div className="text-xs text-font-secondary">Likely to ask for more budget details.</div>
                        </div>
                    </div>
                </Card>

                {/* Risk Analysis */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-warning text-sm">warning</span>
                        <span className="text-xs font-semibold text-font-secondary uppercase">Potential Risks</span>
                    </div>
                    <div className="space-y-2">
                        <div className="bg-background-primary p-3 rounded-lg border border-warning/20 shadow-sm text-sm text-font-primary">
                            <span className="text-warning font-medium">Too informal:</span> "Hey guys" might be inappropriate for the CFO.
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-xs bg-background-primary">Replace with "Dear Team"</Button>
                            </div>
                        </div>
                        <div className="bg-background-primary p-3 rounded-lg border border-palette-10/20 shadow-sm text-sm text-font-primary">
                            <span className="text-palette-10 font-medium">Vague timeline:</span> "Soon" is ambiguous.
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-xs bg-background-primary">Specify Date</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copilot Chat (Placeholder) */}
                <div className="mt-6 pt-4 border-t border-comp-divider">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-brand text-sm">auto_awesome</span>
                        <span className="text-xs font-semibold text-font-secondary uppercase">AI Copilot</span>
                    </div>
                    <div className="bg-background-primary p-3 rounded-lg border border-brand/10 shadow-sm text-sm text-font-secondary italic">
                        "The tone is generally good, but consider adding an executive summary at the top for the CFO."
                    </div>
                    <div className="mt-2 flex">
                        <input
                            className="bg-background-primary border border-comp-divider rounded-full px-4 py-2 text-xs w-full focus:outline-none focus:border-brand/30"
                            placeholder="Ask AI to adjust..."
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
