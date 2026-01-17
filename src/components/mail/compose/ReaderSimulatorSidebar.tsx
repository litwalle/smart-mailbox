import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface ReaderSimulatorSidebarProps {
    mockData?: any
}

export function ReaderSimulatorSidebar({ mockData }: ReaderSimulatorSidebarProps) {
    const [selectedPersona, setSelectedPersona] = React.useState('cfo')

    const personas = [
        { id: 'cfo', name: 'Sarah Chen', role: 'CFO', avatar: 'face_3', mood: 'Critical', color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'pm', name: 'Mike Ross', role: 'Project Manager', avatar: 'face_6', mood: 'Busy', color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'cto', name: 'David Kim', role: 'CTO', avatar: 'face_2', mood: 'Neutral', color: 'text-blue-500', bg: 'bg-blue-50' },
    ]

    const activePersona = personas.find(p => p.id === selectedPersona)

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500">psychology</span>
                    <span className="font-semibold text-slate-700">Reader Simulator</span>
                </div>
            </div>

            {/* Persona Switcher */}
            <div className="p-4 border-b border-slate-200 bg-white">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 block">Simulate Perspective</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {personas.map(persona => (
                        <button
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona.id)}
                            className={`
                                flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all border
                                ${selectedPersona === persona.id
                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                    : 'bg-white border-slate-200 hover:border-indigo-100 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className="material-symbols-outlined text-2xl text-slate-600">{persona.avatar}</span>
                            <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">{persona.role}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Simulation Result */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Mood Prediction */}
                <Card className="p-4 border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Predicted Reaction</span>
                        <span className="text-xs text-slate-400">85% Confidence</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activePersona?.bg}`}>
                            <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                        </div>
                        <div>
                            <div className={`font-bold ${activePersona?.color}`}>{activePersona?.mood}</div>
                            <div className="text-xs text-slate-500">Likely to ask for more budget details.</div>
                        </div>
                    </div>
                </Card>

                {/* Risk Analysis */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase">Potential Risks</span>
                    </div>
                    <div className="space-y-2">
                        <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm text-sm text-slate-700">
                            <span className="text-red-500 font-medium">Too informal:</span> "Hey guys" might be inappropriate for the CFO.
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-xs bg-white">Replace with "Dear Team"</Button>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm text-sm text-slate-700">
                            <span className="text-amber-600 font-medium">Vague timeline:</span> "Soon" is ambiguous.
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-xs bg-white">Specify Date</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copilot Chat (Placeholder) */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-indigo-500 text-sm">auto_awesome</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase">AI Copilot</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-indigo-50 shadow-sm text-sm text-slate-600 italic">
                        "The tone is generally good, but consider adding an executive summary at the top for the CFO."
                    </div>
                    <div className="mt-2 flex">
                        <input
                            className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs w-full focus:outline-none focus:border-indigo-300"
                            placeholder="Ask AI to adjust..."
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
