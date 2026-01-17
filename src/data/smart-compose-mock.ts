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
