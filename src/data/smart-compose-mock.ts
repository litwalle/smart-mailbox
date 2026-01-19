export const mockSmartComposeData = {
    expansion: {
        trigger: "meeting next friday",
        result: "I would like to propose a meeting next Friday, October 24th, at 2:00 PM to discuss the project roadmap and align on key deliverables."
    },
    personas: [
        {
            id: 'cfo',
            role: 'CFO',
            name: 'Sarah Chen',
            reaction: {
                mood: 'Cautious',
                summary: 'Concerned about budget implications.',
                risks: [
                    { type: 'tone', message: 'Too informal for a financial request.', suggestion: 'Use more formal language.' },
                    { type: 'clarity', message: 'ROI is not clearly stated.', suggestion: 'Add a section on expected returns.' }
                ]
            }
        },
        {
            id: 'pm',
            role: 'Project Manager',
            name: 'Mike Ross',
            reaction: {
                mood: 'Enthusiastic',
                summary: 'Likes the clear timeline.',
                risks: []
            }
        }
    ]
}

export interface ProofreadingError {
    id: string
    text: string // The wrong text to find
    type: 'spelling' | 'grammar'
    suggestion: string
    explanation: string
    context: string // Full sentence context
}

export const mockProofreadingErrors: ProofreadingError[] = [
    {
        id: '1',
        text: 'meating',
        type: 'spelling',
        suggestion: 'meeting',
        explanation: 'Spelling error detected',
        context: 'I am writing to confirm our meating next Tuesday.'
    },
    {
        id: '2',
        text: 'has',
        type: 'grammar',
        suggestion: 'have',
        explanation: 'Subject-verb agreement error',
        context: 'The team members has completed their tasks.'
    },
    {
        id: '3',
        text: 'definately',
        type: 'spelling',
        suggestion: 'definitely',
        explanation: 'Spelling error detected',
        context: 'We will definately finish the project on time.'
    },
    {
        id: '4',
        text: 'recieve',
        type: 'spelling',
        suggestion: 'receive',
        explanation: 'Spelling error: "i" before "e" except after "c"',
        context: 'Did you recieve the documents I sent yesterday?'
    },
    {
        id: '5',
        text: 'teh',
        type: 'spelling',
        suggestion: 'the',
        explanation: 'Common typo',
        context: 'Please check teh attached file for details.'
    },
    {
        id: '6',
        text: 'effect',
        type: 'grammar',
        suggestion: 'affect',
        explanation: 'Usage error: "effect" is usually a noun, "affect" is a verb',
        context: 'This change will not effect the timeline.'
    },
    {
        id: '7',
        text: 'your',
        type: 'grammar',
        suggestion: 'you\'re',
        explanation: 'Grammar error: possessive "your" vs contraction "you\'re"',
        context: 'I heard your going to lead the new initiative.'
    }
]
